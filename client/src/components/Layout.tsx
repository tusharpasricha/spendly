import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './theme-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function Layout() {
  const location = useLocation();

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return 'Statistics';
    if (path === '/accounts') return 'Accounts';
    if (path === '/transactions') return 'Transactions';
    if (path === '/import') return 'Import';
    return 'Page';
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-subtle px-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-3" />
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-xs">Spendly</BreadcrumbLink>
              </BreadcrumbItem>
              {location.pathname !== '/' && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">{getBreadcrumbs()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <footer className="border-subtle py-2 px-4">
          <div className="text-center text-[10px] text-muted-foreground">
            <p>&copy; 2024 Spendly. All rights reserved.</p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;

