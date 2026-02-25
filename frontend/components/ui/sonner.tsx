"use client";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      closeButton
      duration={4000}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-rose-500" />,
        loading: <Loader2Icon className="size-5 animate-spin text-slate-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-950/90 group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md group-[.toaster]:max-w-[350px] group-[.toaster]:rounded-lg",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-slate-400 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-slate-50 group-[.toast]:text-slate-900 group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400 group-[.toast]:font-medium",
          closeButton:
            "group-[.toast]:bg-slate-950 group-[.toast]:text-slate-50 group-[.toast]:border-slate-800 group-[.toast]:hover:bg-slate-800 transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
