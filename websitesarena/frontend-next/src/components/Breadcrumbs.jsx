"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isLast = index === pathnames.length - 1;
    const formattedName = name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name: formattedName,
      path: routeTo,
      isLast,
    };
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://websitesarena.com",
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: `https://websitesarena.com${crumb.path}`,
      })),
    ],
  };

  if (pathnames.length === 0) return null;

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Head>

      <nav className="flex py-3 px-5 text-gray-400 text-sm">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="mx-2">/</span>
            {crumb.isLast ? (
              <span className="text-blue-400">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.path}
                className="hover:text-blue-400 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
