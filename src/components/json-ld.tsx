import React from "react";

type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Renders a `<script type="application/ld+json">` tag from a plain object.
 * Safe to use in Server Components — this component itself does not need
 * to be a Client Component.
 */
export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
