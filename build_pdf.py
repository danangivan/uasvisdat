from markdown_pdf import Section, MarkdownPdf

with open('makalah/makalah_ieee.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Replace image paths to relative for markdown_pdf
md_content = md_content.replace('/makalah/', '')

pdf = MarkdownPdf(toc_level=2)
pdf.add_section(Section(md_content, root='makalah'))
pdf.save('makalah/makalah_ieee.pdf')
print("Successfully generated makalah/makalah_ieee.pdf via markdown_pdf!")
