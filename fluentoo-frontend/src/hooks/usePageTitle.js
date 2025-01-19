import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'Fluentoo';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
};

export default usePageTitle;
