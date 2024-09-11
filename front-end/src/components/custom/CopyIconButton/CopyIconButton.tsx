import React, { useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';


interface CopyIconButtonProps {
  textToCopy: string;
}

const CopyIconButton: React.FC<CopyIconButtonProps> = ({ textToCopy }) => {
  
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log('Text copied to clipboard:', textToCopy);
      },
      (err: Error) => {
        console.error('Failed to copy text: ', err);
      }
    );
  };

  return (
    <DocumentDuplicateIcon
      className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-800"
      onClick={copyToClipboard}
      title="Copy to clipboard" // Optional: adds a tooltip on hover
    />
  );
};

export default CopyIconButton;
