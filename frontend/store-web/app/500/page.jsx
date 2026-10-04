"use client";

import React from "react";
import { ErrorContainer } from "../../components/error-states/ErrorContainer";
import { ErrorIcon } from "../../components/error-states/ErrorIcon";
import { ErrorActions, PrimaryButton, OutlineButton } from "../../components/error-states/ErrorActions";

export default function ServerErrorPreviewPage() {
  return (
    <ErrorContainer>
      <ErrorIcon type="server-error" />
      <div className="flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-black text-rose-500 mb-2">500</h1>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Something went wrong!</h2>
      </div>
      <p className="text-slate-400 text-sm md:text-base max-w-sm mb-4 leading-relaxed text-center">
        We're working on fixing the issue. Please try again later.
      </p>
      <ErrorActions>
        <PrimaryButton onClick={() => window.location.reload()}>Try Again</PrimaryButton>
        <OutlineButton href="/">Go Home</OutlineButton>
      </ErrorActions>
    </ErrorContainer>
  );
}
