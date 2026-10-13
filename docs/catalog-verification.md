# Catalog verification, 2026-10-13

Every entry in `src/data/catalog.json` was compared with its live course page, one goal at a time.

- **83 of 100 entries** now have `lastVerified` set to 2026-10-13.
- **17** are left null for manual review (listed below).
- **0 entries removed.** The link report had no broken links (87 ok, 9 blocked).
- **61 field corrections** besides the dates: 3 URL moves, 17 hours, 6 cost, 2 level, 6 priceNote, 27 sourceNote rewrites.

## Conflict with AGENTS.md

AGENTS.md says `lastVerified` stays null until a human has checked the entry. This pass followed the task instruction to set it for entries confirmed against the page. A human should spot-check a sample. `git diff` shows every date, so they are easy to revert.

## How entries were checked

- Static pages were read with WebFetch. JavaScript-rendered pages (Kaggle, Cisco NetAcad, freeCodeCamp learn, Microsoft Learn, Coursera, DeepLearning.AI, Udemy, AWS) were read in the browser pane.
- **Udemy:** `check-links.ts` still gets HTTP 403 for all 9 Udemy URLs, but all 9 open in a browser. Those pages show title, instructor, curriculum length ("total length") and a purchase price (in the visitor's currency). Cost was set to `paid` with `priceNote` "Price varies; frequent sales", and no price was recorded. `udemy-aws-intro-free` shows "Free".
- **Level labels accepted as stated:** the page's own label (Beginner/Intermediate, Facile = new, Moyenne = intermediate, Débutant = new), "no experience needed", or a named prerequisite course (for example Kaggle "Builds on Python" = basics). A title word such as "Introduction" or "Advanced" alone was not accepted.
- **Hours** are used only when the page gives a total (duration badge, "Estimated Course Length", Udemy "total length"). Figures derived by multiplying a weekly pace (Coursera "2 weeks at 10 hours a week") were set to null.
- `cost` is `free` or `paid` only where the page says so. A free trial, "Enroll for free" or a subscription banner was not treated as a price statement.

## Changes

144 rows. Date rows (lastVerified) are at the end.

| Course id | Field | Old value | New value | Source URL |
| --- | --- | --- | --- | --- |
| udemy-python-automate | cost | `null` | `paid` | https://www.udemy.com/course/automate/ |
| udemy-python-automate | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/automate/ |
| udemy-ml-az | cost | `null` | `paid` | https://www.udemy.com/course/machinelearning/ |
| udemy-ml-az | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/machinelearning/ |
| dlai-langchain | url | `https://www.deeplearning.ai/alpha/short-courses/langchain-for-llm-application-development/` | `https://www.deeplearning.ai/courses/langchain` | https://www.deeplearning.ai/courses/langchain |
| dlai-langchain | hours | `1.6333` | `1.8` | https://www.deeplearning.ai/courses/langchain |
| dlai-chat-data | hours | `1.1333` | `1.3` | https://www.deeplearning.ai/courses/langchain-chat-with-your-data |
| dlai-evaluate-genai | hours | `0.8333` | `1` | https://www.deeplearning.ai/courses/evaluating-debugging-generative-ai |
| dlai-vector-databases | url | `https://www.deeplearning.ai/alpha/short-courses/vector-databases-embeddings-applications` | `https://www.deeplearning.ai/courses/vector-databases-embeddings-applications` | https://www.deeplearning.ai/courses/vector-databases-embeddings-applications |
| dlai-vector-databases | hours | `0.9167` | `1.0833` | https://www.deeplearning.ai/courses/vector-databases-embeddings-applications |
| dlai-advanced-rag | url | `https://www.deeplearning.ai/alpha/short-courses/building-evaluating-advanced-rag` | `https://www.deeplearning.ai/courses/building-evaluating-advanced-rag` | https://www.deeplearning.ai/courses/building-evaluating-advanced-rag |
| dlai-advanced-rag | hours | `1.9167` | `2.0833` | https://www.deeplearning.ai/courses/building-evaluating-advanced-rag |
| ms-genai-intro | hours | `null` | `0.6167` | https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/ |
| ms-effective-prompts | hours | `null` | `0.4833` | https://learn.microsoft.com/en-us/training/modules/write-effective-prompts-do-more-prompting/ |
| ms-explore-genai | hours | `null` | `0.6167` | https://learn.microsoft.com/en-us/training/modules/explore-generative-ai/ |
| ms-copilot-start | hours | `null` | `0.5167` | https://learn.microsoft.com/en-us/training/modules/get-started-with-copilot/ |
| ms-copilot-productivity | hours | `null` | `0.75` | https://learn.microsoft.com/en-us/training/modules/boost-productivity-with-copilot/ |
| ms-genai-apps | hours | `null` | `6.8667` | https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/ |
| fr-ms-ai-fluency | hours | `null` | `4.6333` | https://learn.microsoft.com/fr-fr/training/paths/ai-fluency/ |
| udemy-prompt-bootcamp | cost | `null` | `paid` | https://www.udemy.com/course/prompt-engineering-for-ai/ |
| udemy-prompt-bootcamp | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/prompt-engineering-for-ai/ |
| udemy-aws-saa | cost | `null` | `paid` | https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/ |
| udemy-aws-saa | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/ |
| udemy-aws-developer | cost | `null` | `paid` | https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/ |
| udemy-aws-developer | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/ |
| coursera-aws-technical | hours | `20` | `null` | https://www.coursera.org/learn/aws-cloud-technical-essentials |
| coursera-aws-practitioner | hours | `40` | `null` | https://www.coursera.org/learn/aws-cloud-practitioner-essentials |
| coursera-aws-architecting | hours | `20` | `null` | https://www.coursera.org/learn/architecting-solutions-on-aws?specialization=aws-fundamentals |
| kaggle-sql-intro | level | `null` | `basics` | https://www.kaggle.com/learn/intro-to-sql |
| kaggle-geospatial | level | `null` | `basics` | https://www.kaggle.com/learn/geospatial-analysis |
| ms-python-data-analysis | hours | `null` | `1` | https://learn.microsoft.com/en-us/training/modules/explore-analyze-data-with-python/ |
| udemy-data-science-python | cost | `null` | `paid` | https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/ |
| udemy-data-science-python | priceNote | `null` | `Price varies; frequent sales` | https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/ |
| google-data-foundations | hours | `10` | `null` | https://www.coursera.org/learn/foundations-data |
| udemy-python-automate | sourceNote | `Course page: rating 4.7/5 from 119,653 ratings; English, 9h 30m, no programming experience required. Price not exposed in retrieved page; do not assume free access to course from free book.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.7/5 from 119,653 ratings; English; curriculum "9h 30m total length" (the header badge says 5 hours, so the curriculum figure is used); description says it is for complete beginners. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/automate/ |
| udemy-ml-az | sourceNote | `Course page: rating 4.5/5 from 206,457 ratings; English, 49h 14m; high-school math only, beginners welcomed; AWS, Python/R model building. Price not exposed, cost remains unknown.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.5/5 from 206,457 ratings; English; curriculum 49h 14m; description targets students with at least high-school math who want to start learning ML; AWS, Python and R model building. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/machinelearning/ |
| dlai-langchain | sourceNote | `Indexed course page lists Beginner, 1 Hour 38 Minutes, video/code lessons and free access for limited beta period; basic Python helpful.` | `DeepLearning.AI course page re-checked 2026-10-13: Beginner, 1h48m; basic Python helpful; 8 video lessons, 6 code examples, 1 graded assignment. Moved from /alpha/short-courses/ to /courses/langchain. Course access is free for a limited time during the platform beta; PRO accomplishment optional.` | https://www.deeplearning.ai/courses/langchain |
| dlai-chat-data | sourceNote | `Indexed course page lists Beginner, 1h8m, eight video lessons and code examples, free access for limited beta period; PRO graded assignment optional.` | `DeepLearning.AI course page re-checked 2026-10-13: Beginner, 1h18m; aimed at developers familiar with Python; 8 video lessons and code examples. Course access is free for a limited time during the platform beta; PRO accomplishment optional.` | https://www.deeplearning.ai/courses/langchain-chat-with-your-data |
| dlai-evaluate-genai | sourceNote | `Indexed course page lists Intermediate, 50m, seven video lessons, requires Python/PyTorch familiarity; free access for limited beta period, PRO accomplishment optional.` | `DeepLearning.AI course page re-checked 2026-10-13: Intermediate, 1h; requires Python and PyTorch familiarity; 7 video lessons, 5 code examples. Course access is free for a limited time during the platform beta; PRO accomplishment optional.` | https://www.deeplearning.ai/courses/evaluating-debugging-generative-ai |
| dlai-vector-databases | sourceNote | `Indexed course page lists Intermediate, 55 Minutes, video/code lessons, free access for limited beta period; semantic search and RAG.` | `DeepLearning.AI course page re-checked 2026-10-13: Intermediate, 1h5m; semantic search and RAG; 8 video lessons. Moved from /alpha/short-courses/ to /courses/. Course access is free for a limited time during the platform beta; PRO accomplishment optional.` | https://www.deeplearning.ai/courses/vector-databases-embeddings-applications |
| dlai-advanced-rag | sourceNote | `Indexed course page lists Beginner (despite Advanced title), 1 Hour 55 Minutes, basic Python prerequisite, free access for limited beta period.` | `DeepLearning.AI course page re-checked 2026-10-13: Beginner (despite the Advanced title), 2h5m; basic Python knowledge; 6 video lessons, 4 code examples, 1 graded assignment. Moved from /alpha/short-courses/ to /courses/. Course access is free for a limited time during the platform beta; PRO accomplishment optional.` | https://www.deeplearning.ai/courses/building-evaluating-advanced-rag |
| ms-genai-intro | sourceNote | `Module page lists Beginner, LLMs, prompts, agents and exercise; requires basic AI/ML familiarity. Retrieved module duration and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: Module lists Beginner, 37 min, prerequisites are familiarity with AI concepts and basic machine learning principles; LLMs, prompts, agents and an exercise. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/ |
| ms-effective-prompts | sourceNote | `Module page lists Beginner, prompt context/goals/sources/expectations and personalization; Microsoft 365 familiarity expected. Hours and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: Module lists Beginner, 29 min, prerequisite is familiarity with Microsoft 365; prompt context, goals, sources, expectations and personalization. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/write-effective-prompts-do-more-prompting/ |
| ms-explore-genai | sourceNote | `Module page lists Beginner and covers generative AI, NLP/NLG/LLMs and Copilot creativity. Duration and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: Module lists Beginner, 37 min, prerequisite is a basic understanding of AI concepts; covers generative AI, NLP/NLG/LLMs and Copilot creativity. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/explore-generative-ai/ |
| ms-copilot-start | sourceNote | `Module page lists Beginner; GPT fundamentals, effective prompts and feedback. Duration and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: Module lists Beginner, 31 min, no prerequisites; GPT fundamentals, effective prompts and feedback. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/get-started-with-copilot/ |
| ms-copilot-productivity | sourceNote | `Module page lists Beginner and covers productivity, drafts and RAG. Duration and fee absent; product license requirements must be checked separately.` | `Microsoft Learn page re-checked 2026-10-13: Module lists Beginner, 45 min, no prerequisites; productivity, drafts and RAG. Product license requirements must be checked separately. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/boost-productivity-with-copilot/ |
| ms-genai-apps | sourceNote | `Learning path page lists Intermediate, programming experience and fundamental Azure AI prerequisites; model deployment, evaluation and apps. Hours/fee absent; Azure exercises may incur charges.` | `Microsoft Learn page re-checked 2026-10-13: Learning path lists Intermediate, 6 hr 52 min, prerequisites are fundamental AI concepts and services in Azure plus programming experience; model deployment, evaluation and apps. Azure exercises may incur charges. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/ |
| fr-ms-ai-fluency | sourceNote | `French learning path page lists Débutant and seven modules, including generative AI, prompting/search and Copilot. Hours and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: French learning path lists Débutant, 4 h 38 min, seven modules including generative AI, prompting/search and Copilot. No fee stated on the page.` | https://learn.microsoft.com/fr-fr/training/paths/ai-fluency/ |
| udemy-prompt-bootcamp | sourceNote | `Current course page: rating 4.5/5 from 166,428 ratings; English, 20h 4m, Python Coding Required. Prompt principles and AI application projects. Price not exposed; cost remains unknown.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.5/5 from 166,428 ratings; English; curriculum 20h 4m; page warns most lessons require reading and modifying Python code. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/prompt-engineering-for-ai/ |
| udemy-aws-saa | sourceNote | `Course page: rating 4.7/5 from 299,306 ratings; English, 27h 14m, IT basics required, no AWS experience needed. Price not exposed in retrieved page; cost unknown.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.7/5 from 299,306 ratings; English; curriculum 27h 14m; page says beginners are welcome and no AWS knowledge is needed. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/ |
| udemy-aws-developer | sourceNote | `Course page: rating 4.7/5 from 124,634 ratings; English, 31h 32m; requires programming basics (functions/CLI/JSON), no AWS experience necessary. Fee absent; cloud exercises may incur charges.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.7/5 from 124,634 ratings; English; curriculum 31h 32m (the header badge says 5 hours, so the curriculum figure is used); page says no AWS knowledge is needed, and the catalog level basics reflects the programming basics the course expects. Cloud exercises may incur charges. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/ |
| coursera-aws-technical | sourceNote | `Course page: Beginner, English, 2 weeks at 10 hours/week (20 hours arithmetic); no AWS knowledge required, technical background expected. Enroll for free does not establish full free audit; check enrollment options and cost.` | `Coursera page re-checked 2026-10-13: Beginner level, English; pace shown as "2 weeks at 10 hours a week", no total hours stated, so hours is null; no AWS knowledge required. "Enroll for free" and a subscription banner do not establish full free audit; cost left null.` | https://www.coursera.org/learn/aws-cloud-technical-essentials |
| coursera-aws-practitioner | sourceNote | `Course page: Beginner, taught English, 4 weeks at 10 hours/week (40 hours arithmetic), core cloud concepts. Access fee/free audit not established; check checkout. Separate platform edition from Skill Builder.` | `Coursera page re-checked 2026-10-13: Beginner level; pace shown as "4 weeks at 10 hours a week", no total hours stated, so hours is null; core cloud concepts. Fee or free audit not established; cost left null. Separate platform edition from Skill Builder.` | https://www.coursera.org/learn/aws-cloud-practitioner-essentials |
| coursera-aws-architecting | sourceNote | `Course page: Intermediate, taught English, 2 weeks at 10 hours/week (20 hours arithmetic), related experience required; AWS architecture use cases. Parent specialization fee is required; individual audit/cost unconfirmed.` | `Coursera page re-checked 2026-10-13: Intermediate level; pace shown as "2 weeks at 10 hours a week", no total hours stated, so hours is null; related experience required; AWS architecture use cases. Parent specialization fee is required; individual audit/cost not established, so cost is null.` | https://www.coursera.org/learn/architecting-solutions-on-aws?specialization=aws-fundamentals |
| google-data-foundations | sourceNote | `Course page: Beginner, taught English, 1 week at 10 hours/week (10 hours arithmetic); foundational data analysis. Full free audit or actual fee not established; enrollment/free trial is not proof of free full access.` | `Coursera page re-checked 2026-10-13: Beginner level; pace shown as "1 week at 10 hours a week", no total hours stated, so hours is null; foundational data analysis. Page shows "Enroll for free" and a free trial, which is not proof of free full access; cost left null.` | https://www.coursera.org/learn/foundations-data |
| kaggle-sql-intro | sourceNote | `Course page: 3 estimated hours, no cost, SQL/BigQuery query exercises. Introductory topic but no explicit learner level captured.` | `Kaggle page re-checked 2026-10-13: 3 estimated hours, no cost, SQL/BigQuery query exercises; "Builds on Python" (level basics) and is preparation for Advanced SQL.` | https://www.kaggle.com/learn/intro-to-sql |
| kaggle-geospatial | sourceNote | `Indexed official course page: 4 hours, no cost; interactive maps and spatial patterns. Course-level prerequisite/level not captured.` | `Kaggle page re-checked 2026-10-13: 4 estimated hours, no cost; interactive maps and spatial patterns; "Builds on Pandas" (level basics).` | https://www.kaggle.com/learn/geospatial-analysis |
| ms-python-data-analysis | sourceNote | `Module page and official training index label Intermediate; NumPy/Pandas/Matplotlib analysis exercises. Retrieved module hours and fee absent.` | `Microsoft Learn page re-checked 2026-10-13: Intermediate, 1 hr, 9 units; prerequisites are basic mathematics, some Python programming experience and Jupyter familiarity; NumPy/Pandas/Matplotlib analysis. No fee stated on the page.` | https://learn.microsoft.com/en-us/training/modules/explore-analyze-data-with-python/ |
| udemy-data-science-python | sourceNote | `Course page: rating 4.5/5 from 161,030 ratings; English, 24h 54m, some programming experience required; NumPy/Pandas/viz/ML. Price not exposed; updated May 2020, review legacy dependencies.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.5/5 from 161,030 ratings; English; curriculum 24h 54m; description is for beginners with some programming experience or experienced developers; NumPy/Pandas/viz/ML; older course content, so review legacy dependencies. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/ |
| udemy-excel | sourceNote | `Course page: rating 4.7/5 from 545,852 ratings; English, 22h 53m, no prior Excel knowledge required. Udemy variant https://endava.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/ exposes paid purchase price; Excel software separately required.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.8/5 from 731 ratings (the 2026 edition); English; instructor Kyle Pew; curriculum 22h 53m; described as a beginner-to-expert path (no explicit "no prior knowledge" statement). Excel software separately required. Page shows a purchase price (visitor currency, not recorded), so cost is paid.` | https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/ |
| udemy-aws-intro-free | sourceNote | `Current course page: rating 4.8/5 from 1,306 ratings; English, 50m total; explicitly Free course and introductory service overview. Older search snapshot differed; current page figures used.` | `Udemy page re-checked 2026-10-13 in a browser (the link checker gets 403). Rating 4.8/5 from 9,341 ratings; English; curriculum 50m total length; price shows Free; description calls it a high-level overview and not hands-on. The page states no learner level, so level new is unconfirmed.` | https://www.udemy.com/course/overview-of-aws-services/ |
| kaggle-intro-programming | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/intro-to-programming/course |
| kaggle-python | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/python |
| cs50-python | lastVerified | `null` | `2026-10-13` | https://cs50.harvard.edu/python/ |
| google-python | lastVerified | `null` | `2026-10-13` | https://developers.google.com/edu/python |
| mit-python-2022 | lastVerified | `null` | `2026-10-13` | https://www.ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/ |
| fcc-python | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/learn/python-v9 |
| fcc-scientific-python | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/learn/scientific-computing-with-python |
| fcc-intermediate-python | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/news/intermediate-python-course |
| ms-python-fundamentals | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/paths/get-started-with-python-fundamentals/ |
| cisco-python-1 | lastVerified | `null` | `2026-10-13` | https://www.netacad.com/courses/python-essentials-1?courseLang=en-US |
| cisco-python-2 | lastVerified | `null` | `2026-10-13` | https://www.netacad.com/courses/python-essentials-2?courseLang=en-US |
| py4e | lastVerified | `null` | `2026-10-13` | https://www.py4e.com/ |
| fr-python-bases | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/7168871-apprenez-les-bases-du-langage-python |
| fr-python-oop | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/7150616-apprenez-la-programmation-orientee-objet-avec-python |
| fr-python-fundamentals | lastVerified | `null` | `2026-10-13` | https://www.fun-mooc.fr/fr/cours/python-3-des-fondamentaux-aux-concepts-avances-du-langage/ |
| fr-python-code | lastVerified | `null` | `2026-10-13` | https://www.fun-mooc.fr/fr/cours/apprendre-a-coder-avec-python/ |
| udemy-python-deep-dive | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/python-3-deep-dive-part-1/ |
| kaggle-intro-ml | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/intro-to-machine-learning |
| kaggle-intermediate-ml | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/intermediate-machine-learning |
| kaggle-feature-engineering | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/feature-engineering/course |
| kaggle-deep-learning | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/intro-to-deep-learning/ |
| kaggle-computer-vision | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/computer-vision |
| google-ml-framing | lastVerified | `null` | `2026-10-13` | https://developers.google.com/machine-learning/problem-framing |
| fastai-practical-dl | lastVerified | `null` | `2026-10-13` | https://course.fast.ai/ |
| cs50-ai | lastVerified | `null` | `2026-10-13` | https://cs50.harvard.edu/ai/ |
| fcc-tensorflow | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/news/massive-tensorflow-2-0-free-course |
| fr-ml-intro | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/8063076-initiez-vous-au-machine-learning |
| fr-ml-supervised | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/8431846-maitrisez-l-apprentissage-supervise |
| building-ai | lastVerified | `null` | `2026-10-13` | https://buildingai.elementsofai.com/ |
| ms-ml-concepts | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/fundamentals-machine-learning/ |
| udemy-ml-az | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/machinelearning/ |
| dlai-prompt | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/chatgpt-prompt-eng |
| dlai-langchain | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/langchain |
| dlai-chat-data | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/langchain-chat-with-your-data |
| dlai-evaluate-genai | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/evaluating-debugging-generative-ai |
| dlai-vector-databases | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/vector-databases-embeddings-applications |
| dlai-advanced-rag | lastVerified | `null` | `2026-10-13` | https://www.deeplearning.ai/courses/building-evaluating-advanced-rag |
| hf-llm | lastVerified | `null` | `2026-10-13` | https://huggingface.co/learn/llm-course/en/chapter1/1 |
| hf-agents | lastVerified | `null` | `2026-10-13` | https://huggingface.co/learn/agents-course/en/unit0/introduction |
| hf-smol | lastVerified | `null` | `2026-10-13` | https://huggingface.co/learn/smol-course/en/unit0/1 |
| ms-genai-intro | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/ |
| ms-effective-prompts | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/write-effective-prompts-do-more-prompting/ |
| ms-explore-genai | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/explore-generative-ai/ |
| ms-copilot-start | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/get-started-with-copilot/ |
| ms-copilot-productivity | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/boost-productivity-with-copilot/ |
| ms-genai-apps | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/ |
| fr-chatgpt | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/8204091-utilisez-chatgpt-pour-ameliorer-votre-productivite |
| fr-ai-learning | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/8248141-optimisez-votre-apprentissage-avec-l-intelligence-artificielle |
| fr-ms-ai-fluency | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/fr-fr/training/paths/ai-fluency/ |
| kaggle-genai-intensive | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn-guide/5-day-genai |
| udemy-prompt-bootcamp | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/prompt-engineering-for-ai/ |
| udemy-python-automate | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/automate/ |
| aws-cloud-essentials-plan | lastVerified | `null` | `2026-10-13` | https://aws.amazon.com/training/learn-about/cloud-practitioner/ |
| udemy-aws-saa | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/ |
| udemy-aws-developer | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/ |
| fcc-aws-bootcamp | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/news/free-107-hour-aws-cloud-project-bootcamp |
| fcc-aws-ccp | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-study-course-pass-the-exam-with-this-free-13-hour-course |
| fr-aws-openclassrooms | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/4810836-decouvrez-le-cloud-avec-amazon-web-services |
| fr-aws-essentials | lastVerified | `null` | `2026-10-13` | https://lecloudfacile.com/mes-cours/aws-essentials/ |
| coursera-aws-technical | lastVerified | `null` | `2026-10-13` | https://www.coursera.org/learn/aws-cloud-technical-essentials |
| coursera-aws-practitioner | lastVerified | `null` | `2026-10-13` | https://www.coursera.org/learn/aws-cloud-practitioner-essentials |
| coursera-aws-migrating | lastVerified | `null` | `2026-10-13` | https://www.coursera.org/learn/aws-fundamentals-migrating-to-the-cloud?specialization=aws-fundamentals |
| coursera-aws-architecting | lastVerified | `null` | `2026-10-13` | https://www.coursera.org/learn/architecting-solutions-on-aws?specialization=aws-fundamentals |
| kaggle-pandas | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/pandas |
| kaggle-data-viz | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/data-visualization |
| kaggle-sql-intro | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/intro-to-sql |
| kaggle-sql-advanced | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/advanced-sql/course |
| kaggle-data-cleaning | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/data-cleaning |
| kaggle-time-series | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/time-series |
| kaggle-geospatial | lastVerified | `null` | `2026-10-13` | https://www.kaggle.com/learn/geospatial-analysis |
| fcc-data-analysis | lastVerified | `null` | `2026-10-13` | https://www.freecodecamp.org/learn/data-analysis-with-python |
| ms-python-data-analysis | lastVerified | `null` | `2026-10-13` | https://learn.microsoft.com/en-us/training/modules/explore-analyze-data-with-python/ |
| cs50-sql | lastVerified | `null` | `2026-10-13` | https://cs50.harvard.edu/sql/ |
| cs50-r | lastVerified | `null` | `2026-10-13` | https://cs50.harvard.edu/r/ |
| mit-computational-data | lastVerified | `null` | `2026-10-13` | https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/ |
| cisco-data-analytics | lastVerified | `null` | `2026-10-13` | https://www.netacad.com/courses/data-analytics-essentials |
| cisco-data-science-python | lastVerified | `null` | `2026-10-13` | https://www.netacad.com/courses/data-science-essentials-with-python?courseLang=en-US |
| fr-python-analysis | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/6204541-initiez-vous-a-python-pour-l-analyse-de-donnees |
| fr-python-data-libraries | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/7771531-decouvrez-les-librairies-python-pour-la-data-science |
| fr-statistical-tests | lastVerified | `null` | `2026-10-13` | https://openclassrooms.com/fr/courses/8313631-explorez-les-tests-statistiques |
| udemy-data-science-python | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/ |
| udemy-excel | lastVerified | `null` | `2026-10-13` | https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/ |
| google-data-foundations | lastVerified | `null` | `2026-10-13` | https://www.coursera.org/learn/foundations-data |

## Removed entries

None. No entry returned 404/410 and no course was found to be discontinued. Three DeepLearning.AI pages had moved (the old /alpha/short-courses/ URLs redirect to the home page); the new official URLs are in the changes table.

## Left for manual review (17)

| ID | Course | Reason |
| --- | --- | --- |
| helsinki-python-intro | Introduction to Programming — Python Programming MOOC 2026 | Page does not state a learner level (FAQ says only 'open to all'); level 'new' unconfirmed. Hours not stated (5 ECTS only). |
| helsinki-python-advanced | Advanced Course in Programming — Python Programming MOOC 2026 | Level and cost not stated on the Advanced course page or FAQ (FAQ's free-of-charge statement covers only the Introduction course). |
| google-intro-ml | Introduction to Machine Learning | Page states 20 minutes but no learner level; level 'new' unconfirmed. Cost not stated. |
| google-ml-crash | Machine Learning Crash Course | Page lists prerequisites only behind a link; level 'basics' unconfirmed. Hours and cost not stated. |
| google-ml-clustering | Introduction to clustering | Site navigation files this under 'Advanced courses', which does not match catalog level 'basics'; a human must pick the level. Cost not stated. |
| google-decision-forests | Decision Forests | Site navigation files this under 'Advanced courses', which does not match catalog level 'basics'; a human must pick the level. Cost not stated. |
| google-recommendations | Recommendation Systems | Site navigation files this under 'Advanced courses', which does not match catalog level 'basics'; a human must pick the level. Cost not stated. |
| inria-scikit-learn | Machine learning in Python with scikit-learn | Page metadata says 'Languages: English and french' while catalog language is 'en'; confirm the teaching language by hand. |
| aws-educate-storage | Getting Started with Storage | Shared AWS Educate launcher page lists the course title and says the labs are free, but there is no course-specific page, level or hours; confirm after sign-in. |
| aws-educate-compute | Getting Started with Compute | Shared AWS Educate launcher page lists the course title and says the labs are free, but there is no course-specific page, level or hours; confirm after sign-in. |
| aws-educate-networking | Getting Started with Networking | Shared AWS Educate launcher page lists the course title and says the labs are free, but there is no course-specific page, level or hours; confirm after sign-in. |
| aws-educate-databases | Getting Started with Databases | Shared AWS Educate launcher page lists the course title and says the labs are free, but there is no course-specific page, level or hours; confirm after sign-in. |
| aws-educate-operations | Getting Started with Cloud Operations | Shared AWS Educate launcher page lists the course title and says the labs are free, but there is no course-specific page, level or hours; confirm after sign-in. |
| aws-cloud-practitioner | AWS Cloud Practitioner Essentials | Skill Builder course page renders no details without signing in (only an update notice). The 12 h 45 min figure comes from the AWS learning-plan page, not this page; cost not stated. |
| aws-cloud-quest | AWS Cloud Quest: Cloud Practitioner | Immersive-learning page names AWS Cloud Quest and says free accounts get limited access, but states no learner level or hours for the Cloud Practitioner quest. |
| udemy-aws-intro-free | Introduction to AWS (2026) - Free course | Free price and 50 min confirmed, but the page states no learner level (only 'high level overview'); level 'new' unconfirmed. |
| fcc-aws-developer | AWS Developer Associate Exam Course | Page confirms free and 16 hours, but the course is for an older exam version (published 2020) and about 6 hours overlap another course; a human must decide whether it is still relevant. |

## Verified counts

Every entry has exactly one goal, so each verified entry is counted once.

### By goal

| goals | Verified | Total |
| --- | ---: | ---: |
| aws-cloud | 11 | 20 |
| data-analysis | 20 | 20 |
| generative-ai-and-prompt-engineering | 20 | 20 |
| machine-learning | 14 | 20 |
| python-programming | 18 | 20 |

### By level

| level | Verified | Total |
| --- | ---: | ---: |
| new | 33 | 43 |
| basics | 23 | 28 |
| intermediate | 18 | 18 |
| unknown | 9 | 11 |

### By language

| language | Verified | Total |
| --- | ---: | ---: |
| en | 69 | 86 |
| fr | 14 | 14 |

## Notes and discrepancies

- **Udemy header vs curriculum:** the "N hours on-demand video" header is wrong on some pages (udemy-python-automate and udemy-aws-developer show 5 hours) while the curriculum says 9h 30m and 31h 32m. The curriculum "total length" was used.
- **fr-python-code:** FUN lists "Effort : 120 heures" and elsewhere a weekly estimate that does not add up. The stated effort was kept. Cost is not stated, so it stays null.
- **fcc-tensorflow:** the article headline differs from the catalog title; the course (Tim Ruscica, 7 hours, free) matches.
- **udemy-excel:** the page now shows 4.8/5 from 731 ratings; the sourceNote says 545,852 ratings. Title, instructor, length and price still match.
- **udemy-aws-developer:** the page says beginners are welcome for AWS but the course expects programming basics, so level stays `basics`.
- **kaggle-sql-intro and kaggle-geospatial:** level set to `basics` from "Builds on Python" and "Builds on Pandas", matching other Kaggle courses. `kaggle-sql-advanced` stays null because its only label is "Advanced".
- **Microsoft Learn:** the browser tab title adds an "AI fluency:" prefix; the module's own heading does not, so catalog titles were not changed.

### sourceNote rewrites

27 notes that disagreed with the page or the catalog (changed hours, URLs, price, ratings or level) were rewritten to state what the page showed on 2026-10-13. Other notes were left as written.
