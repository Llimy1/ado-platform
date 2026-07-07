"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import styles from "./ado-project-list-route.module.css";
import buttonStyles from "@/components/Button.module.css";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { MachineValue } from "@/components/MachineValue";
import { EmptyState, ErrorState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import { projectClient } from "@/lib/data/ado-projects";
import { AdoApiError } from "@/lib/api/errors";
import type { AdoProject } from "@/lib/contracts/ado-project";

export interface AdoProjectListError {
  code: string;
  message: string;
}

interface AdoProjectListRouteProps {
  initialItems: AdoProject[] | null;
  initialError?: AdoProjectListError | null;
}

export function AdoProjectListRoute({ initialItems, initialError }: AdoProjectListRouteProps) {
  const [items, setItems] = useState<AdoProject[]>(initialItems ?? []);
  const [error, setError] = useState<AdoProjectListError | null>(initialError ?? null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const nextItems = await projectClient.listProjects();
      setItems(nextItems);
      setError(null);
    } catch (err) {
      setError(
        err instanceof AdoApiError
          ? { code: err.code, message: err.message }
          : { code: "NETWORK_ERROR", message: err instanceof Error ? err.message : "네트워크 오류가 발생했습니다." },
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <div>
      <p className={styles.breadcrumb}>ADO Control Room</p>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>ADO Projects</h1>
          <span className={styles.resultCount}>{items.length}건</span>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" dense onClick={refresh} disabled={isRefreshing}>
            {isRefreshing ? "새로고침 중" : "새로고침"}
          </Button>
          <Link
            href="/ado-projects/new"
            className={[buttonStyles.button, buttonStyles.primary, buttonStyles.sizeDense].join(" ")}
          >
            새 프로젝트
          </Link>
        </div>
      </div>

      {error ? (
        <ErrorState title={error.message} requestId={error.code} onRetry={refresh} />
      ) : items.length === 0 ? (
        <EmptyState title="등록된 프로젝트가 없습니다." />
      ) : (
        <Panel>
          <div className={styles.wrapper}>
            <table className={styles.table}>
              <caption className={styles.caption}>ADO 프로젝트 목록, {items.length}건</caption>
              <thead>
                <tr>
                  <th scope="col">이름</th>
                  <th scope="col">프로젝트 키</th>
                  <th scope="col">생성일</th>
                  <th scope="col">
                    <span className={styles.caption}>열기</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link href={`/ado-projects/${item.projectKey}`} className={styles.projectName}>
                        {item.name}
                      </Link>
                      <MachineValue value={item.id} label="Project ID" />
                    </td>
                    <td>{item.projectKey}</td>
                    <td>{formatAbsoluteTime(item.createdAt)}</td>
                    <td>
                      <Link className={styles.openLink} href={`/ado-projects/${item.projectKey}`}>
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
