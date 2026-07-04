"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./ado-project-create-form.module.css";
import buttonStyles from "@/components/Button.module.css";
import { Button } from "@/components/Button";
import { Panel } from "@/components/Panel";
import { projectClient } from "@/lib/data/ado-projects";
import { AdoApiError } from "@/lib/api/errors";
import type { AdoApiFieldError } from "@/lib/contracts/ado-project";

interface SubmitError {
  code: string;
  message: string;
  fieldErrors: AdoApiFieldError[];
}

export function AdoProjectCreateForm() {
  const router = useRouter();
  const [projectKey, setProjectKey] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<SubmitError | null>(null);

  const isKeyConflict = error?.code === "PROJECT_KEY_ALREADY_EXISTS";
  const projectKeyError =
    error?.fieldErrors.find((e) => e.field === "projectKey")?.message ??
    (isKeyConflict ? "이미 존재하는 프로젝트 키입니다." : undefined);
  const nameError = error?.fieldErrors.find((e) => e.field === "name")?.message;
  const generalError =
    error && error.code !== "VALIDATION_FAILED" && error.code !== "PROJECT_KEY_ALREADY_EXISTS"
      ? error.message
      : undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await projectClient.createProject({ projectKey, name });
      router.push(`/ado-projects/${created.id}`);
    } catch (err) {
      setError(
        err instanceof AdoApiError
          ? { code: err.code, message: err.message, fieldErrors: err.fieldErrors }
          : {
              code: "NETWORK_ERROR",
              message: err instanceof Error ? err.message : "네트워크 오류가 발생했습니다.",
              fieldErrors: [],
            },
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
      <h1 className={styles.title}>새 프로젝트</h1>
      <Panel>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="project-key">
              프로젝트 키
            </label>
            <input
              id="project-key"
              className={styles.input}
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
              aria-invalid={Boolean(projectKeyError)}
              aria-describedby={projectKeyError ? "project-key-error" : undefined}
            />
            {projectKeyError ? (
              <p id="project-key-error" className={styles.fieldError}>
                {projectKeyError}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="project-name">
              이름
            </label>
            <input
              id="project-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "project-name-error" : undefined}
            />
            {nameError ? (
              <p id="project-name-error" className={styles.fieldError}>
                {nameError}
              </p>
            ) : null}
          </div>

          {generalError ? (
            <p className={styles.formError} role="alert">
              {generalError}
            </p>
          ) : null}

          <div className={styles.actions}>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "생성 중" : "생성"}
            </Button>
            <Link
              href="/ado-projects"
              className={[buttonStyles.button, buttonStyles.ghost, buttonStyles.sizeDefault].join(" ")}
            >
              취소
            </Link>
          </div>
        </form>
      </Panel>
    </div>
  );
}
