'use client';

import { Github, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivateRepoAccessProps {
  repoUrl: string;
  projectTitle: string;
}

export default function PrivateRepoAccess({ repoUrl, projectTitle }: PrivateRepoAccessProps) {
  const handleRequestAccess = () => {
    const subject = encodeURIComponent(`Access request: ${projectTitle} repository`);
    const body = encodeURIComponent(`Hi Chester,

I'm interested in viewing your repository for the project "${projectTitle}".

Repository URL: ${repoUrl}

Could you please:
1. Verify if this repository exists and is accessible
2. Grant me temporary access to view this repository if it's private
3. Or provide an alternative way to view the code

My GitHub username: [Your GitHub username]

Thank you!`);

    window.open(`mailto:maligaso.chesterlukea@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-foreground">
          <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-lg sm:text-xl font-bold">Private repository</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
          This repository is private for work reasons. Choose how you&apos;d like to request access.
        </p>
      </div>

      {/* Access options */}
      <div className="space-y-2">
        <Button onClick={handleRequestAccess} className="w-full">
          <ExternalLink className="size-4" aria-hidden="true" />
          Request access by email
        </Button>

        <Button variant="outline" asChild className="w-full">
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            <Github className="size-4" aria-hidden="true" />
            Open on GitHub
          </a>
        </Button>
      </div>

      {/* Info note */}
      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="text-muted-foreground text-xs leading-relaxed text-center">
          I usually grant temporary collaborator access for portfolio viewers.
        </p>
      </div>
    </div>
  );
}
