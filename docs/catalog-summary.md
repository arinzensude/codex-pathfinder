# Catalog research summary

Research date: 2026-10-13. All records are drafts; web research and HTTP checks are not human verification.

100 unique course/learning-path/module entries. free: 60; paid: 2; unknown cost: 38. 61 entries have at least one unknown level, hours, or cost field.

| Goal | Total | New | Basics | Intermediate | Unknown level | English | French |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| python-programming | 20 | 11 | 4 | 3 | 2 | 16 | 4 |
| machine-learning | 20 | 3 | 12 | 4 | 1 | 18 | 2 |
| generative-ai-and-prompt-engineering | 20 | 12 | 4 | 3 | 1 | 17 | 3 |
| aws-cloud | 20 | 13 | 2 | 3 | 2 | 18 | 2 |
| data-analysis | 20 | 4 | 4 | 5 | 7 | 17 | 3 |

## Level and language together

| Goal | Language | New | Basics | Intermediate | Unknown level | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| python-programming | en | 9 | 3 | 2 | 2 | 16 |
| python-programming | fr | 2 | 1 | 1 | 0 | 4 |
| machine-learning | en | 3 | 12 | 2 | 1 | 18 |
| machine-learning | fr | 0 | 0 | 2 | 0 | 2 |
| generative-ai-and-prompt-engineering | en | 9 | 4 | 3 | 1 | 17 |
| generative-ai-and-prompt-engineering | fr | 3 | 0 | 0 | 0 | 3 |
| aws-cloud | en | 12 | 2 | 2 | 2 | 18 |
| aws-cloud | fr | 1 | 0 | 1 | 0 | 2 |
| data-analysis | en | 3 | 4 | 3 | 7 | 17 |
| data-analysis | fr | 1 | 0 | 2 | 0 | 3 |

Counts are goal memberships. All current entries have one goal tag. AWS Educate has five distinct courses behind one shared registration/course-selection URL; the catalog therefore has 96 unique URLs.

## Evidence and access limitations

- Every entry retains its course URL and a sourceNote explaining the page evidence or the limitations of indexed retrieval. Selected supporting excerpts are saved in catalog-page-evidence.json.
- A sourceNote may cite an official course listing when a course page requires JavaScript or sign-in. Resolve course-specific details before human verification; do not treat a reachable launcher as confirmed enrollment.
- Coursera enrollment or trial wording does not establish free audit access. Unknown access costs remain null; check individual enrollment options and financial aid eligibility. No fixed Udemy prices are stored.
- Udemy course ratings (not instructor ratings or student counts) were checked against 4.5/5 and 1,000 ratings. Recheck them before verifying a record; they change over time.
- DeepLearning.AI pages state free access for a limited beta period; optional PRO assessments/accomplishments are separate. Cloud services, software licenses, hardware, exam fees and certificates may cost extra.
- French coverage reaches at least two distinct courses for every goal. French website navigation and automatic subtitles alone were not used as proof of French teaching. Inria scikit-learn is English-only despite bilingual metadata. French Udemy AWS candidates checked did not qualify.
- Legacy freeCodeCamp certifications, the 2020 AWS Developer video, the 2016 MIT course and the 2020 Udemy data-science course need relevance/tool-version review.

## Normalization

- new corresponds to explicit beginner/Débutant/Facile or explicit no-experience audience statements. basics is used only where the page describes an existing foundation/prerequisite (recorded in sourceNote). intermediate corresponds to Intermediate/Moyenne or an explicitly intermediate prerequisite. An advanced title alone is not mapped to intermediate.
- Durations are numeric hours. Minutes are divided by 60; explicitly stated weeks × hours/week are multiplied. Range estimates, ECTS credits, and days without hourly effort are left null. Original figures are retained in sourceNote.
- dataWeight is a catalog policy derived from observed delivery format, not measured bytes or a provider claim: text/interactive lessons are low; videos up to two stated hours are medium; longer or unknown-length video courses are high. AWS Cloud Quest is high because it is a 3D game. Optional videos, datasets and notebook runtimes can still require substantial bandwidth.

Run npm run catalog:report to validate and regenerate this summary and catalog-todo.md. Run npm run check-links to regenerate the HTTP report. Neither command sets lastVerified.
