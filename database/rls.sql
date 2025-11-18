-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Função auxiliar para verificar se é admin ou manager (evita recursão nas políticas RLS)
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role VARCHAR(20);
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN v_role IN ('admin', 'manager');
END;
$$;

-- Função auxiliar para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role VARCHAR(20);
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN v_role = 'admin';
END;
$$;

-- Admin e Manager podem visualizar todos os usuários
CREATE POLICY "Admin/Manager can view all users" ON public.users
    FOR SELECT USING (public.is_admin_or_manager());

-- Admin e Manager podem atualizar todos os usuários
CREATE POLICY "Admin/Manager can update all users" ON public.users
    FOR UPDATE USING (public.is_admin_or_manager());

-- Admin e Manager podem inserir novos usuários
CREATE POLICY "Admin/Manager can insert users" ON public.users
    FOR INSERT WITH CHECK (public.is_admin_or_manager());

-- Categories policies (all authenticated users can view, admin/manager can modify)
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin/Manager can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
            AND active = true
        )
    );

-- Products policies (all authenticated users can view, admin/manager can modify)
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin/Manager can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
            AND active = true
        )
    );

-- Customers policies (all authenticated users can view and add, admin/manager can modify)
CREATE POLICY "Anyone can view customers" ON public.customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can add customers" ON public.customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin/Manager can update customers" ON public.customers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
            AND active = true
        )
    );

CREATE POLICY "Admin can delete customers" ON public.customers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
            AND active = true
        )
    );

-- Sales policies (users can view own sales or all if admin/manager)
CREATE POLICY "Users can view own sales" ON public.sales
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
            AND active = true
        )
    );

CREATE POLICY "Users can create sales" ON public.sales
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        (user_id = auth.uid() OR user_id IS NULL)
    );

CREATE POLICY "Admin/Manager can update sales" ON public.sales
    FOR UPDATE USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
            AND active = true
        )
    );

-- Sale items policies (follow same rules as sales)
CREATE POLICY "Users can view sale items" ON public.sale_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sales 
            WHERE id = sale_id 
            AND (
                user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'manager')
                    AND active = true
                )
            )
        )
    );

CREATE POLICY "Users can manage sale items" ON public.sale_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sales 
            WHERE id = sale_id 
            AND (
                user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'manager')
                    AND active = true
                )
            )
        )
    );
