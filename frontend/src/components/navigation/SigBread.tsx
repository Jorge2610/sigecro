"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function SigBread() {
  interface BreadData {
    path: string;
    pathUrl: string;
  }

  let paths: Array<string> = usePathname().split("/");
  const page: string = paths[paths.length - 1];
  paths = paths.slice(1, paths.length - 1);

  const getURL = (index: number) => {
    let url = "";
    for (let i = 0; i <= index; i++) {
      url += "/" + paths[i];
    }
    return url;
  };

  const getPath = (index: number) => {
    let path: string = paths[index].replaceAll("-", " ");
    path = path.replace(path[0], path[0].toUpperCase());
    return path;
  };

  const breadData: Array<BreadData> = [];
  for (let i = 0; i < paths.length; i++) {
    const data: BreadData = { path: getPath(i), pathUrl: getURL(i) };
    breadData.push(data);
  }

  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {page.length > 0 ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={"/"}>Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>User</BreadcrumbPage>
            </BreadcrumbItem>
          )}
          {breadData.map((data) => {
            return (
              <div key={data.path} className="inline-flex items-center gap-1.5">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={data.pathUrl}>{data.path}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              </div>
            );
          })}
          {page.length > 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>
                {page
                  .replace(page[0], page[0].toUpperCase())
                  .replaceAll("-", " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <></>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
