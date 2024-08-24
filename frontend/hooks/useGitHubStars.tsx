'use client';

import { useState, useEffect } from 'react';

const useGitHubStars = (repoName: string) => {
  const [stars, setStars] = useState(300); // Default value

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoName}`,
          {
            headers: process.env.NEXT_PUBLIC_GITHUB_OAUTH_TOKEN
              ? {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_OAUTH_TOKEN}`,
                  'Content-Type': 'application/json',
                }
              : {},
            next: {
              revalidate: 3600,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count || stars);
        }
      } catch (error) {
        console.error('Error fetching GitHub stars:', error);
      }
    };

    fetchStars();
  }, [repoName]);

  return stars;
};

export default useGitHubStars;
