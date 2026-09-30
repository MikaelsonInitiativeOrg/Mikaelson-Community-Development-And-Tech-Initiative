import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The main headline of your article. Keep it inspiring, clear, and engaging.",
      validation: (R) => R.required().max(120).warning("Shorter titles perform better in search and social cards."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Click 'Generate' to create the URL slug from your title (e.g. 'how-we-build-student-discipline').",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category / Theme",
      type: "string",
      description: "Select an ecosystem theme or enter a custom category.",
      options: {
        list: [
          { title: "Leadership & Discipline", value: "Leadership" },
          { title: "Mikaelson School Club", value: "Communities" },
          { title: "Mikaelson Labs & Tech", value: "Innovation" },
          { title: "African Studies & Culture", value: "African Studies" },
          { title: "Student Growth & Mindset", value: "Growth" },
          { title: "Partnerships & Community", value: "Partnerships" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt / Summary",
      type: "text",
      rows: 3,
      description: "A short 1-3 sentence summary that appears on blog cards, search results, the homepage popup, and WhatsApp/Twitter previews.",
      validation: (R) => R.required().max(260).warning("Keep excerpts under 260 characters so they display cleanly on cards and mobile screens."),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Main photograph for the article and social share cards (recommended 1200x630px or high-res landscape).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe what is shown in the image for accessibility and SEO.",
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Optional photo credit or short caption shown beneath the image.",
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author Details",
      type: "object",
      description: "Who wrote or contributed this story.",
      fields: [
        defineField({
          name: "name",
          title: "Author Name",
          type: "string",
          placeholder: "e.g. Michael Segun or Mikaelson Editorial Team",
          initialValue: "Mikaelson Editorial Team",
        }),
        defineField({
          name: "role",
          title: "Author Role / Title",
          type: "string",
          placeholder: "e.g. Founder & Initiative Lead, Facilitator, Student Fellow",
        }),
        defineField({
          name: "avatar",
          title: "Author Photo",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Date and time this article was published. Posts are ordered by this date.",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "showAsPopup",
      title: "Feature as Homepage Pop-up?",
      type: "boolean",
      description: "When enabled, this story will be highlighted in the floating pop-up announcement on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Write your full story here. You can format headings, quotes, bullet lists, numbered lists, links, and insert photos.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote / Pullquote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet List", value: "bullet" },
            { title: "Numbered List", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Meta Title (Optional)",
      type: "string",
      description: "Custom title for search engines and social cards if you want it different from the main article title.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Meta Description (Optional)",
      type: "text",
      rows: 2,
      description: "Custom description for search engines and social cards if you want it different from the excerpt.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
      isPopup: "showAsPopup",
    },
    prepare({ title, subtitle, media, isPopup }) {
      return {
        title: isPopup ? `🌟 ${title || "Untitled"}` : title || "Untitled",
        subtitle: subtitle || "Uncategorized",
        media,
      };
    },
  },
});
