CREATE TABLE public."Credentials" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "userName" text,
    email text,
    "phoneNumber" text,
    "userId" uuid,
    "staffId" uuid,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    password text
);
CREATE TABLE public."Sessions" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    token uuid DEFAULT public.gen_random_uuid(),
    "credentialId" uuid,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public."Staffs" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    "phoneNumber" numeric,
    email text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    role text
);
CREATE TABLE public."Transactions" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type text DEFAULT 'cashIn'::text,
    method jsonb,
    "imageUrl" text,
    amount numeric,
    "userId" uuid,
    "createdAt" timestamp with time zone DEFAULT now(),
    index integer NOT NULL
);
CREATE SEQUENCE public."Transactions_index_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Transactions_index_seq" OWNED BY public."Transactions".index;
CREATE TABLE public."Users" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    email text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "phoneNumber" text
);
ALTER TABLE ONLY public."Transactions" ALTER COLUMN index SET DEFAULT nextval('public."Transactions_index_seq"'::regclass);
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_phoneNumber_key" UNIQUE ("phoneNumber");
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_staffId_key" UNIQUE ("staffId");
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_userId_key" UNIQUE ("userId");
ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Staffs"
    ADD CONSTRAINT "Staff_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_index_key" UNIQUE (index);
ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staffs"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES public."Credentials"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
