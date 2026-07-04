"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ado-project-detail-route.module.css";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { formatAbsoluteTime } from "@/lib/format";
import type { AdoProject } from "@/lib/contracts/ado-project";

export function AdoProjectDetailRoute({ project }: { project: AdoProject }) {
  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/ado-projects">ADO Projects</Link>
      </p>
      <div className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
      </div>
      <Panel title="프로젝트 정보">
        <dl className={styles.fieldList}>
          <dt className={styles.fieldLabel}>ID</dt>
          <dd className={styles.fieldValue}>{project.id}</dd>
          <dt className={styles.fieldLabel}>프로젝트 키</dt>
          <dd className={styles.fieldValue}>{project.projectKey}</dd>
          <dt className={styles.fieldLabel}>이름</dt>
          <dd className={styles.fieldValue}>{project.name}</dd>
          <dt className={styles.fieldLabel}>생성일</dt>
          <dd className={styles.fieldValue}>{formatAbsoluteTime(project.createdAt)}</dd>
          <dt className={styles.fieldLabel}>수정일</dt>
          <dd className={styles.fieldValue}>{formatAbsoluteTime(project.updatedAt)}</dd>
        </dl>
      </Panel>
    </div>
  );
}

/** Distinct from the generic ErrorState: PROJECT_NOT_FOUND is an expected, addressable outcome (bad id/link), not an unexpected failure. */
export function AdoProjectNotFound({ projectId }: { projectId: string }) {
  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/ado-projects">ADO Projects</Link>
      </p>
      <div className={styles.notFoundWrap} role="alert">
        <p>ID {projectId}에 해당하는 프로젝트를 찾을 수 없습니다.</p>
        <p className={styles.notFoundCode}>PROJECT_NOT_FOUND</p>
        <Link href="/ado-projects">목록으로 돌아가기</Link>
      </div>
    </div>
  );
}

/** Generic failure (not the addressable 404 case) — offers retry via router.refresh(). */
export function AdoProjectLoadError({ code, message }: { code: string; message: string }) {
  const router = useRouter();
  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/ado-projects">ADO Projects</Link>
      </p>
      <div className={styles.notFoundWrap} role="alert">
        <p>{message}</p>
        <p className={styles.notFoundCode}>{code}</p>
        <Button variant="secondary" dense onClick={() => router.refresh()}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}
