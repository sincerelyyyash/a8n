"use client"
import * as React from "react";
import { useCallback, useMemo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Trash2, Plus, Loader2, CheckCircle, XCircle, Play, Brain, Mail, MessageSquare, Webhook, Zap } from "lucide-react";

export type MediaTitleNodeData = {
  imageSrc?: string;
  title?: string;
  onClick?: () => void;
  onDelete?: () => void;
  onAddNext?: () => void;
  executionStatus?: 'idle' | 'executing' | 'success' | 'error';
  executionResult?: any;
  executionError?: string;
  service?: { key?: string; data?: any };
  triggerType?: string;
};

export const MediaTitleNode = ({ data }: NodeProps) => {
  const d = (data || {}) as MediaTitleNodeData;
  const title = (d && typeof d.title === "string" && d.title.trim().length > 0)
    ? d.title
    : "Untitled";

  const executionStatus = d?.executionStatus || 'idle';

  const imageSrc = (d && typeof d.imageSrc === "string" && d.imageSrc.trim().length > 0)
    ? d.imageSrc
    : undefined;

  // Get icon based on service type or trigger type (prioritize icons over images)
  const getNodeIcon = useMemo(() => {
    // Check for trigger type first
    if (d?.triggerType) {
      switch (d.triggerType) {
        case 'webhook':
          return <Webhook className="size-4 text-foreground" />;
        case 'manual':
          return <Play className="size-4 text-foreground" />;
        default:
          return <Zap className="size-4 text-foreground" />;
      }
    }
    
    // Check for service key
    const serviceKey = d?.service?.key;
    if (serviceKey) {
      switch (serviceKey) {
        case 'ai_model':
          return <Brain className="size-4 text-foreground" />;
        case 'send_email':
        case 'send_email_and_wait':
          return <Mail className="size-4 text-foreground" />;
        case 'telegram_message':
          return <MessageSquare className="size-4 text-foreground" />;
        default:
          break;
      }
    }
    
    // Default fallback icon
    return <Zap className="size-4 text-foreground" />;
  }, [d?.service?.key, d?.triggerType]);

  const handleClick = useCallback(() => {
    if (d && typeof d.onClick === "function") {
      d.onClick();
      return;
    }
  }, [d]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const getStatusIcon = () => {
    switch (executionStatus) {
      case 'executing':
        return <Loader2 className="size-3 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="size-3 text-green-500" />;
      case 'error':
        return <XCircle className="size-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (executionStatus) {
      case 'executing':
        return 'border-blue-500/50 bg-blue-50/50';
      case 'success':
        return 'border-green-500/50 bg-green-50/50';
      case 'error':
        return 'border-red-500/50 bg-red-50/50';
      default:
        return 'border-border/60 bg-card/50 hover:bg-card/80 hover:border-foreground/40';
    }
  };

  return (
    <div className="select-none min-w-[8rem] max-w-[16rem]">
      <div
        role="button"
        tabIndex={0}
        aria-label={String(title)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`group w-full px-2 py-2 rounded-lg border transition-colors cursor-pointer focus:outline-none relative ${getStatusColor()}`}
      >
        <div className="flex items-center gap-2">
          <div className="shrink-0 size-6 rounded-md border border-border/60 bg-muted overflow-hidden grid place-items-center relative">
            {/* Show icon if we have service/trigger type, otherwise show image if available */}
            {(d?.service?.key || d?.triggerType) ? (
              getNodeIcon
            ) : imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc as string} alt="" className="w-full h-full object-cover" />
            ) : (
              getNodeIcon
            )}
            {/* Status indicator overlay */}
            {executionStatus !== 'idle' && (
              <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 border border-border/60">
                {getStatusIcon()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-foreground break-words whitespace-normal">{String(title)}</p>
            <p className="text-[8px] text-muted-foreground truncate">
              {executionStatus === 'executing' ? 'Executing...' : 
               executionStatus === 'success' ? 'Completed' :
               executionStatus === 'error' ? 'Failed' : 'Click to configure'}
            </p>
          </div>
        </div>

        <div className="absolute -top-1 right-1 hidden group-hover:flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Add next"
            className="size-4 grid place-items-center rounded-md bg-muted border border-border/60 hover:bg-background"
            onClick={(e) => { e.stopPropagation(); d?.onAddNext && d.onAddNext(); }}
          >
            <Plus className="size-2" />
          </button>
          <button
            type="button"
            aria-label="Delete node"
            className="size-4 grid place-items-center rounded-md bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20"
            onClick={(e) => { e.stopPropagation(); d?.onDelete && d.onDelete(); }}
          >
            <Trash2 className="size-2" />
          </button>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-foreground/70" />
      <Handle type="source" position={Position.Right} className="!bg-foreground/70" />
    </div>
  );
};

export default MediaTitleNode;


