// Landing page copy (hero -> problem -> mechanism -> benefits -> FAQ -> final CTA).
// Every claim here must stay true of the product as built — no invented stats or testimonials.

export const hero = {
  preHeadline: 'For students and early-career engineers applying to tech roles',
  headlineStart: 'See your resume',
  headlineMarked: 'the way a recruiter does',
  headlineEnd: '— and fix it before you apply.',
  subHeadline:
    'Upload your resume and get a score out of 100, your strongest and weakest points, and line-by-line rewrites — judged against the same recruiter rubric every time.',
  ctaText: 'Get My Resume Score',
  reassurance: ['No sign-up', 'PDF or DOCX', 'Your file is never saved'],
}

export const problem = {
  eyebrow: 'Sound familiar?',
  recognition:
    'If you’re tired of applying into silence, getting “looks fine” from friends, and pasting your resume into a chatbot that says something different every time — you’re in the right place.',
  painPoints: [
    {
      title: 'Applications go nowhere',
      body: 'You’ve sent out dozens of applications, heard nothing back, and still don’t know which line is costing you the interview.',
    },
    {
      title: 'Reviews take days',
      body: 'Waiting on a senior or mentor slows you down — and two reviewers rarely agree on what to fix.',
    },
    {
      title: 'Keyword checkers miss the point',
      body: 'ATS scanners count keywords, but they can’t tell you that “Worked on backend development” says nothing.',
    },
    {
      title: 'Chatbots give vague feedback',
      body: 'Paste your resume into a generic chatbot and you get padded advice framed differently every time.',
    },
  ],
}

export const mechanism = {
  eyebrow: 'How it works',
  name: 'The Recruiter Rubric',
  whatItDoes:
    'The analyzer reads the text of your resume and scores it against a fixed rubric a technical recruiter would use. Every resume is judged on the same criteria, so your feedback is specific, consistent, and comparable between drafts.',
  criteria: [
    { name: 'Clarity', detail: 'Is it easy to scan? Are bullets concise?' },
    { name: 'Impact', detail: 'Does each line show a measurable result, not just a duty?' },
    { name: 'Consistency', detail: 'Same tense, same bullet structure, no filler phrases.' },
    { name: 'Job fit', detail: 'Paste a job description to check keywords and skills.' },
  ],
  steps: [
    { title: 'Upload your resume', body: 'Drop in a PDF or DOCX. Paste a job description too, if you have one.' },
    { title: 'Get scored on the rubric', body: 'The AI reviews every line the way a technical recruiter would.' },
    { title: 'Fix what matters', body: 'Act on your score, strengths, weaknesses and ready-to-edit rewrites.' },
  ],
}

export const benefits = {
  eyebrow: 'What you get',
  heading: 'Feedback you can act on in one sitting',
  items: [
    {
      title: 'A score you can track',
      feature: 'An overall score out of 100 based on the rubric.',
      benefit: 'So you know where you stand — and can see whether each edit moves the needle.',
    },
    {
      title: 'Specific, not generic',
      feature: '3–5 strengths and 3–5 weaknesses, each tied to your actual resume.',
      benefit: 'So you know exactly what to fix, instead of “add more detail.”',
    },
    {
      title: 'Rewrites you can use',
      feature: 'Before-and-after rewrites of your weakest lines.',
      benefit:
        'So vague duties become measurable results. Where a number is missing, you get a [placeholder] to fill with your real figure.',
    },
    {
      title: 'Tailored to the job',
      feature: 'Paste a job description to get a match score and missing keywords.',
      benefit: 'So each application speaks the language of the role you’re applying for.',
    },
  ],
}

export const faq = {
  eyebrow: 'Questions',
  heading: 'Before you upload',
  items: [
    {
      question: 'What exactly does this do?',
      answer:
        'It reads the text of your resume, scores it out of 100 on clarity, impact and consistency, lists your strengths and weaknesses, and rewrites your weakest lines. Add a job description and it also scores how well you match the role.',
    },
    {
      question: 'Who is it for?',
      answer:
        'Students, final-year engineering graduates and early-career job seekers preparing for placements, internships or their next tech role — anyone who wants feedback without waiting on a mentor.',
    },
    {
      question: 'How is this different from asking a chatbot?',
      answer:
        'A chatbot answers a different question each time you ask. This tool uses a fixed recruiter rubric, worked examples of strong resume lines, and a strict output format, so you get the same structured feedback on every run.',
    },
    {
      question: 'Which files work?',
      answer:
        'PDF and DOCX up to 5 MB. The file needs selectable text — scanned images of a resume can’t be read. Feedback is tuned for software and technical roles.',
    },
    {
      question: 'Do I need an account or to pay?',
      answer: 'No. There’s no sign-up and no payment step — upload a file and get your results.',
    },
    {
      question: 'What happens to my resume?',
      answer:
        'It isn’t saved. The file is read in memory, its text is sent to Claude (Anthropic’s AI model) for the review, and it’s discarded once your results are returned.',
    },
    {
      question: 'Should I just apply as-is?',
      answer:
        'A single vague bullet can be the difference between a callback and silence. A review takes about as long as reading this page, so check it before your next application goes out.',
    },
  ],
}

export const finalCta = {
  heading: 'Your next application deserves a second look.',
  body: 'Find out what a recruiter sees in your resume — and what to change — before you hit apply.',
  ctaText: 'Review My Resume',
  microCta: 'Have a job post open? Paste it in for a match score too.',
}
