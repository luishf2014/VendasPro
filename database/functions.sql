-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, role, active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')::VARCHAR(20),
        true
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to ensure user profile exists
CREATE OR REPLACE FUNCTION public.ensure_user_profile(
    p_user_id UUID,
    p_name TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS public.users AS $$
DECLARE
    v_user public.users;
    v_auth_email TEXT;
    v_auth_name TEXT;
BEGIN
    -- Try to get existing user
    SELECT * INTO v_user FROM public.users WHERE id = p_user_id;
    
    IF v_user IS NOT NULL THEN
        RETURN v_user;
    END IF;
    
    -- Get data from auth.users if not provided
    IF p_email IS NULL THEN
        SELECT email INTO v_auth_email FROM auth.users WHERE id = p_user_id;
        p_email := COALESCE(v_auth_email, 'usuario@exemplo.com');
    END IF;
    
    IF p_name IS NULL THEN
        SELECT raw_user_meta_data->>'name' INTO v_auth_name FROM auth.users WHERE id = p_user_id;
        p_name := COALESCE(v_auth_name, SPLIT_PART(p_email, '@', 1), 'Usuário');
    END IF;
    
    -- Insert new user profile
    INSERT INTO public.users (id, name, email, role, active)
    VALUES (p_user_id, p_name, p_email, p_role::VARCHAR(20), true)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = NOW()
    RETURNING * INTO v_user;
    
    RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Function to generate sale number
CREATE OR REPLACE FUNCTION public.generate_sale_number()
RETURNS TEXT AS $$
DECLARE
    v_date TEXT;
    v_sequence INTEGER;
    v_sale_number TEXT;
BEGIN
    v_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Get next sequence for today
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(sale_number FROM LENGTH(sale_number) - 2)
            AS INTEGER
        )
    ), 0) + 1
    INTO v_sequence
    FROM public.sales
    WHERE sale_number LIKE 'VND-' || v_date || '%';
    
    v_sale_number := 'VND-' || v_date || '-' || LPAD(v_sequence::TEXT, 3, '0');
    
    RETURN v_sale_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer total purchases
CREATE OR REPLACE FUNCTION public.update_customer_purchases()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update customer total purchases and last purchase date
        UPDATE public.customers
        SET 
            total_purchases = (
                SELECT COALESCE(SUM(total_amount), 0)
                FROM public.sales
                WHERE customer_id = NEW.customer_id
                AND status = 'completed'
            ),
            last_purchase_date = (
                SELECT MAX(created_at)
                FROM public.sales
                WHERE customer_id = NEW.customer_id
                AND status = 'completed'
            )
        WHERE id = NEW.customer_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- Update customer total purchases after deletion
        UPDATE public.customers
        SET 
            total_purchases = (
                SELECT COALESCE(SUM(total_amount), 0)
                FROM public.sales
                WHERE customer_id = OLD.customer_id
                AND status = 'completed'
            ),
            last_purchase_date = (
                SELECT MAX(created_at)
                FROM public.sales
                WHERE customer_id = OLD.customer_id
                AND status = 'completed'
            )
        WHERE id = OLD.customer_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update customer purchases
CREATE OR REPLACE TRIGGER trigger_update_customer_purchases
    AFTER INSERT OR UPDATE OR DELETE ON public.sales
    FOR EACH ROW EXECUTE FUNCTION public.update_customer_purchases();

-- Function to update product stock
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease stock when sale item is added
        UPDATE public.products
        SET stock_quantity = stock_quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        -- Adjust stock based on quantity change
        UPDATE public.products
        SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- Increase stock when sale item is removed
        UPDATE public.products
        SET stock_quantity = stock_quantity + OLD.quantity
        WHERE id = OLD.product_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product stock (only for completed sales)
CREATE OR REPLACE TRIGGER trigger_update_product_stock
    AFTER INSERT OR UPDATE OR DELETE ON public.sale_items
    FOR EACH ROW 
    WHEN (
        (TG_OP = 'INSERT' AND EXISTS (SELECT 1 FROM public.sales WHERE id = NEW.sale_id AND status = 'completed')) OR
        (TG_OP = 'UPDATE' AND EXISTS (SELECT 1 FROM public.sales WHERE id = NEW.sale_id AND status = 'completed')) OR
        (TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM public.sales WHERE id = OLD.sale_id AND status = 'completed'))
    )
    EXECUTE FUNCTION public.update_product_stock();
