import Link from "next/link";

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/produits", label: "Produits" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">

            {/* SIDEBAR */}
            <aside className="w-56 flex flex-col bg-white border-r border-gray-100 px-3 py-4">

                {/* Logo */}
                <div className="flex items-center gap-2.5 px-3 pb-5">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">MonApp</span>
                </div>

                {/* Section label */}
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest px-3 mb-1">
                    Navigation
                </p>

                {/* Nav links */}
                <nav className="flex flex-col gap-0.5">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-indigo-700 bg-indigo-50 font-medium"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/clients"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Clients
                    </Link>
                    <Link
                        href="/dashboard/produits"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Produits
                    </Link>
                </nav>

                {/* Footer utilisateur */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                            AB
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Ali Ben</p>
                            <p className="text-xs text-gray-400">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <main className="flex-1 bg-gray-50 overflow-auto">
                {children}
            </main>

        </div>
    );
}
