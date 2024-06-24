export const PageContent = (name, title, description) => {
  const content = `import "react";
import { Page } from "@/components/page/page";

export const ${name} = () => {
  return (
    <Page name="${title}" description="${description}" />
  );
};
`;

  return content;
};
