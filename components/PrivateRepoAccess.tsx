'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink, Lock } from 'lucide-react';

interface PrivateRepoAccessProps {
  repoUrl: string;
  projectTitle: string;
}

export default function PrivateRepoAccess({ repoUrl, projectTitle }: PrivateRepoAccessProps) {

  const handleRequestAccess = () => {
    const subject = encodeURIComponent(`Access Request: ${projectTitle} Repository`);
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
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Private Repository</h3>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
          This repository is private for work purposes. Choose how you&apos;d like to request access.
        </p>
      </div>

      {/* Access Options */}
      <div className="space-y-2">
        {/* Option 1: Request Access */}
        <motion.button
          onClick={handleRequestAccess}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm"
        >
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          Request Access via Email
        </motion.button>

        {/* Option 2: Direct GitHub Link */}
        <motion.a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium border border-white/10 hover:border-white/20 text-sm"
        >
          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
          Try Direct Access
        </motion.a>
      </div>

      {/* Info Note */}
      <div className="p-2 sm:p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
        <p className="text-blue-300 text-xs leading-relaxed text-center">
          I&apos;ll typically grant temporary collaborator access for portfolio viewers.
        </p>
      </div>
    </div>
  );
}
