import React from 'react';
import { format } from 'date-fns';

const SubmissionHistoryModal = ({ isOpen, handleClose, submissions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Submission History</h2>
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <div className="overflow-y-auto max-h-80">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={index} className="p-3 border-b border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Submitted At:</strong> {format(new Date(submission.submittedAt), 'dd MMM yyyy HH:mm')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Notes:</strong> {submission.notes || 'No notes provided'}
                </p>
                {submission.attachments && submission.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments:</p>
                    <ul className="list-disc pl-4 text-sm text-blue-500">
                      {submission.attachments.map((attachment, idx) => (
                        <li key={idx}>
                          <a href={attachment.filePath} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {attachment.filePath.split('/').pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No submission history available.</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleClose} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistoryModal;
