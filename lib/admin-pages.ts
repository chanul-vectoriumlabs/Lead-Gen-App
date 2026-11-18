// Admin pages hidden from navigation and search for now. The pages still exist;
// remove a path here to bring it back.
export const HIDDEN_ADMIN_PAGES = ["/admin/applications", "/admin/logs", "/admin/settings"]

export const isHiddenAdminPage = (href: string) => HIDDEN_ADMIN_PAGES.some((p) => href === p || href.startsWith(`${p}/`))
