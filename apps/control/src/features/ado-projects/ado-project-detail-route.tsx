"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ado-project-detail-route.module.css";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateViews";
import { AdoApiError } from "@/lib/api/errors";
import { roadmapClient } from "@/lib/data/ado-roadmaps";
import { formatAbsoluteTime } from "@/lib/format";
import type { AdoProject } from "@/lib/contracts/ado-project";
import type { AdoRoadmap } from "@/lib/contracts/ado-roadmap";

interface AdoProjectDetailRouteProps {
  project: AdoProject;
  initialRoadmaps: AdoRoadmap[] | null;
  initialRoadmapError?: { code: string; message: string } | null;
}

export function AdoProjectDetailRoute({
  project,
  initialRoadmaps,
  initialRoadmapError,
}: AdoProjectDetailRouteProps) {
  const [roadmaps, setRoadmaps] = useState<AdoRoadmap[]>(initialRoadmaps ?? []);
  const [roadmapKey, setRoadmapKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadmapError, setRoadmapError] = useState(initialRoadmapError ?? null);

  async function handleCreateRoadmap(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setRoadmapError(null);
    try {
      const created = await roadmapClient.createRoadmap(project.projectKey, {
        roadmapKey: roadmapKey.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setRoadmaps((items) => [created, ...items]);
      setRoadmapKey("");
      setTitle("");
      setDescription("");
    } catch (err) {
      setRoadmapError(
        err instanceof AdoApiError
          ? { code: err.code, message: err.message }
          : { code: "NETWORK_ERROR", message: err instanceof Error ? err.message : "네트워크 오류가 발생했습니다." },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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

      <Panel title="로드맵" className={styles.roadmapPanel}>
        <form className={styles.roadmapForm} onSubmit={handleCreateRoadmap}>
          <div className={styles.roadmapField}>
            <label className={styles.fieldLabel} htmlFor="roadmap-key">
              로드맵 키
            </label>
            <input
              id="roadmap-key"
              className={styles.input}
              value={roadmapKey}
              onChange={(e) => setRoadmapKey(e.target.value)}
              required
            />
          </div>
          <div className={styles.roadmapField}>
            <label className={styles.fieldLabel} htmlFor="roadmap-title">
              제목
            </label>
            <input
              id="roadmap-title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.roadmapField}>
            <label className={styles.fieldLabel} htmlFor="roadmap-description">
              설명
            </label>
            <input
              id="roadmap-description"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" dense disabled={isSubmitting}>
            {isSubmitting ? "생성 중" : "로드맵 생성"}
          </Button>
        </form>

        {roadmapError ? (
          <div className={styles.inlineError} role="alert">
            <span>{roadmapError.message}</span>
            <code>{roadmapError.code}</code>
          </div>
        ) : null}

        {roadmaps.length === 0 ? (
          <EmptyState title="등록된 로드맵이 없습니다." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.caption}>프로젝트 로드맵 목록, {roadmaps.length}건</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">제목</th>
                  <th scope="col">상태</th>
                  <th scope="col">생성일</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.map((roadmap) => (
                  <tr key={roadmap.id}>
                    <td>{roadmap.id}</td>
                    <td>
                      <span className={styles.roadmapTitle}>{roadmap.title}</span>
                      {roadmap.description ? (
                        <span className={styles.roadmapDescription}>{roadmap.description}</span>
                      ) : null}
                    </td>
                    <td>{roadmap.status}</td>
                    <td>{formatAbsoluteTime(roadmap.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

/** Distinct from the generic ErrorState: PROJECT_NOT_FOUND is an expected, addressable outcome (bad key/link), not an unexpected failure. */
export function AdoProjectNotFound({ projectKey }: { projectKey: string }) {
  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/ado-projects">ADO Projects</Link>
      </p>
      <div className={styles.notFoundWrap} role="alert">
        <p>프로젝트 키 {projectKey}에 해당하는 프로젝트를 찾을 수 없습니다.</p>
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
