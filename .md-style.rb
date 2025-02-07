all

# Rustdoc and some other markdown parsers don't like 2-space list indent.
rule 'MD007', :indent => 4
# Pandoc generates numbered ordered lists.
rule 'MD029', :style => 'ordered'
# The kramdown table of contents generation needs a bullet point directly before
# the {:toc} directive.
exclude_rule 'MD032'
# We use inline HTML for some things that aren't easily expressed in markdown.
exclude_rule 'MD033'
# We use Jekyll front matter for web page metadata. This includes the title,
# which is used as the first heading.
exclude_rule 'MD041'

# qTox changelog violates these.
exclude_rule 'MD001'
exclude_rule 'MD002'
exclude_rule 'MD007'
exclude_rule 'MD013'
exclude_rule 'MD024'
exclude_rule 'MD030'
exclude_rule 'MD034'
