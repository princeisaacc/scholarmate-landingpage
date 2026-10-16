export const FREE_COURSES = [
  { code: "ACC 102", name: "Intro to Financial Accounting II" },
  { code: "SOC 106", name: "Intro to Sociology II" },
  { code: "AMS 102", name: "Basic Math / Statistics" },
  { code: "AMS 104", name: "Project Management" },
  { code: "ECO 102", name: "Intro to Economics II" },
  { code: "PSY 136", name: "Intro to Psychology" },
  { code: "GST 112", name: "Nigeria People and Culture" },
] as const;

export type CourseCode = (typeof FREE_COURSES)[number]["code"];

export type QuizQ = { q: string; options: string[]; answer: number; explain: string };

export const FREE_QUIZZES: Record<CourseCode, QuizQ[]> = {
  "ACC 102": [
    { q: "Which financial statement shows a company's financial position at a single point in time?", options: ["Income Statement", "Statement of Financial Position", "Cash Flow Statement", "Statement of Changes in Equity"], answer: 1, explain: "The Statement of Financial Position (balance sheet) is a snapshot at one point in time." },
    { q: "The accounting equation is:", options: ["Assets = Liabilities − Equity", "Assets = Liabilities + Equity", "Assets + Liabilities = Equity", "Equity = Assets + Liabilities"], answer: 1, explain: "Assets = Liabilities + Equity is the fundamental accounting equation." },
    { q: "Depreciation is best described as:", options: ["A cash outflow", "An allocation of an asset's cost over its useful life", "A market value decrease", "A reduction in liabilities"], answer: 1, explain: "Depreciation systematically allocates a non-current asset's cost over its useful life." },
    { q: "Under the accrual basis, revenue is recognised when:", options: ["Cash is received", "It is earned, regardless of cash", "Invoice is issued", "The year ends"], answer: 1, explain: "Accrual accounting recognises revenue when earned, not when cash arrives." },
    { q: "Which is a current liability?", options: ["Bank loan due in 5 years", "Trade payables", "Goodwill", "Equipment"], answer: 1, explain: "Trade payables are settled within the normal operating cycle (≤12 months)." },
  ],
  "SOC 106": [
    { q: "Sociology is best defined as the scientific study of:", options: ["Individual behaviour only", "Society and social interaction", "The mind", "Past civilisations"], answer: 1, explain: "Sociology studies society and patterns of social interaction." },
    { q: "Which sociologist coined the term 'sociology'?", options: ["Karl Marx", "Auguste Comte", "Max Weber", "Émile Durkheim"], answer: 1, explain: "Auguste Comte coined the term in the 19th century." },
    { q: "A 'norm' in sociology refers to:", options: ["A statistical average", "Shared rules guiding behaviour", "An economic measure", "A religious doctrine"], answer: 1, explain: "Norms are shared expectations and rules that guide behaviour." },
    { q: "Primary socialisation typically occurs in the:", options: ["Workplace", "Family", "University", "Media"], answer: 1, explain: "The family is the primary agent of early socialisation." },
    { q: "Which is an example of a secondary group?", options: ["A close-knit family", "A study group at a lecture", "Childhood best friends", "Identical twins"], answer: 1, explain: "Secondary groups are larger, impersonal, and goal-oriented, like a study group." },
  ],
  "AMS 102": [
    { q: "The mean of 4, 8, 10, 12, 16 is:", options: ["8", "10", "12", "9"], answer: 1, explain: "Sum = 50, count = 5, mean = 10." },
    { q: "Which measure is most affected by outliers?", options: ["Median", "Mode", "Mean", "Range"], answer: 2, explain: "The mean is pulled by extreme values; median is more robust." },
    { q: "P(getting heads on a fair coin) =", options: ["0", "0.25", "0.5", "1"], answer: 2, explain: "A fair coin has two equally likely outcomes." },
    { q: "If 3x + 6 = 21, then x =", options: ["3", "5", "7", "9"], answer: 1, explain: "3x = 15, so x = 5." },
    { q: "Standard deviation measures:", options: ["Central tendency", "Spread of data", "Skewness", "Sample size"], answer: 1, explain: "It quantifies how spread out values are around the mean." },
  ],
  "AMS 104": [
    { q: "Which is NOT a phase of the project lifecycle?", options: ["Initiation", "Planning", "Marketing", "Closure"], answer: 2, explain: "Marketing is not a standard project lifecycle phase." },
    { q: "A Gantt chart is used to:", options: ["Track finances", "Visualise schedules and dependencies", "Hire staff", "Write code"], answer: 1, explain: "Gantt charts show tasks against time and dependencies." },
    { q: "The triple constraint in project management is:", options: ["Scope, time, cost", "People, process, product", "Risk, reward, return", "Plan, do, check"], answer: 0, explain: "The classic triple constraint balances scope, time, and cost." },
    { q: "A stakeholder is:", options: ["Only the project sponsor", "Anyone affected by the project", "Only the project team", "Only the client"], answer: 1, explain: "Stakeholders are any individuals or groups affected by the project." },
    { q: "Risk management primarily involves:", options: ["Avoiding all work", "Identifying, assessing and responding to risks", "Hiring insurers only", "Documenting after closure"], answer: 1, explain: "Risk management is a proactive identification + response process." },
  ],
  "ECO 102": [
    { q: "The law of demand states that, ceteris paribus, as price rises:", options: ["Quantity demanded rises", "Quantity demanded falls", "Demand is unchanged", "Supply falls"], answer: 1, explain: "Higher prices generally reduce quantity demanded." },
    { q: "GDP stands for:", options: ["Gross Domestic Product", "General Demand Price", "Government Direct Payment", "Gross Direct Profit"], answer: 0, explain: "GDP = total value of goods and services produced in a country." },
    { q: "Inflation is best described as:", options: ["A fall in unemployment", "A sustained rise in the general price level", "Higher exports", "A stock market boom"], answer: 1, explain: "Inflation is a sustained increase in the general price level." },
    { q: "Opportunity cost is:", options: ["Money paid", "The next best alternative forgone", "Total costs", "Sunk cost"], answer: 1, explain: "It's the value of the best alternative you give up." },
    { q: "A market in perfect competition has:", options: ["One seller", "Many sellers with identical products", "Differentiated products", "Strong barriers to entry"], answer: 1, explain: "Perfect competition has many sellers offering homogeneous products." },
  ],
  "PSY 136": [
    { q: "Psychology is the scientific study of:", options: ["Society", "Behaviour and mental processes", "Religion", "Ancient texts"], answer: 1, explain: "Psychology studies behaviour and mental processes." },
    { q: "Who is considered the founder of psychoanalysis?", options: ["B.F. Skinner", "Sigmund Freud", "Carl Rogers", "Jean Piaget"], answer: 1, explain: "Freud founded psychoanalysis in the late 19th century." },
    { q: "Classical conditioning was first demonstrated by:", options: ["Pavlov", "Watson", "Skinner", "Bandura"], answer: 0, explain: "Pavlov's experiments with dogs established classical conditioning." },
    { q: "Short-term memory typically holds about:", options: ["3 items", "7±2 items", "20 items", "Unlimited items"], answer: 1, explain: "Miller's classic 'magic number' is 7±2." },
    { q: "Which is a humanistic psychologist?", options: ["Skinner", "Carl Rogers", "Freud", "Watson"], answer: 1, explain: "Carl Rogers championed person-centred humanistic psychology." },
  ],
  "GST 112": [
    { q: "Nigeria gained independence in:", options: ["1957", "1960", "1963", "1970"], answer: 1, explain: "Nigeria gained independence on October 1, 1960." },
    { q: "Nigeria became a republic in:", options: ["1960", "1963", "1966", "1979"], answer: 1, explain: "Nigeria became a republic on October 1, 1963." },
    { q: "Which is one of the three major ethnic groups in Nigeria?", options: ["Tiv", "Yoruba", "Ijaw", "Nupe"], answer: 1, explain: "The three major groups are Hausa, Igbo and Yoruba." },
    { q: "The current capital of Nigeria is:", options: ["Lagos", "Abuja", "Kano", "Ibadan"], answer: 1, explain: "Abuja became the capital in 1991." },
    { q: "How many states make up the Nigerian federation today?", options: ["30", "36", "37", "40"], answer: 1, explain: "Nigeria has 36 states plus the Federal Capital Territory." },
  ],
};

export const FREE_FLASHCARDS: Record<CourseCode, { front: string; back: string }[]> = {
  "ACC 102": [
    { front: "Define an asset.", back: "A resource controlled by the entity from past events from which future economic benefits are expected." },
    { front: "What is double-entry bookkeeping?", back: "Every transaction has equal debit and credit entries, keeping the accounting equation balanced." },
    { front: "What is the accounting equation?", back: "Assets = Liabilities + Equity." },
    { front: "What is depreciation?", back: "The systematic allocation of a non-current asset's cost over its useful life." },
    { front: "Difference between capital and revenue expenditure?", back: "Capital expenditure creates a long-term asset; revenue expenditure is consumed in the period it's incurred." },
  ],
  "SOC 106": [
    { front: "What is a social institution?", back: "An established pattern of norms and roles built around a basic social need (e.g. family, education)." },
    { front: "Define culture.", back: "The shared values, beliefs, norms, language and material objects of a group of people." },
    { front: "Primary vs secondary group?", back: "Primary = small, intimate (family); Secondary = larger, impersonal, goal-oriented (classmates)." },
    { front: "What is socialisation?", back: "The lifelong process of learning the norms and roles of one's society." },
    { front: "Define social stratification.", back: "The structured ranking of people in society into layers based on wealth, power or prestige." },
  ],
  "AMS 102": [
    { front: "Formula for the mean?", back: "Mean = (sum of all values) ÷ (number of values)." },
    { front: "What is the median?", back: "The middle value when data is arranged in order (or average of two middle values)." },
    { front: "Define probability.", back: "A number between 0 and 1 measuring the likelihood of an event." },
    { front: "What is variance?", back: "The average of the squared deviations from the mean." },
    { front: "Difference between population and sample?", back: "Population = the entire group; Sample = a subset selected from the population." },
  ],
  "AMS 104": [
    { front: "What is a project?", back: "A temporary endeavour undertaken to create a unique product, service or result." },
    { front: "What is a Work Breakdown Structure?", back: "A hierarchical decomposition of a project into smaller, manageable deliverables and tasks." },
    { front: "Define the critical path.", back: "The longest sequence of dependent tasks that determines the shortest project duration." },
    { front: "What is a milestone?", back: "A significant event in a project, usually completion of a major deliverable, with zero duration." },
    { front: "What is scope creep?", back: "The uncontrolled expansion of a project's scope without adjustments to time, cost or resources." },
  ],
  "ECO 102": [
    { front: "Define microeconomics.", back: "The study of individual economic agents: consumers, firms and markets." },
    { front: "What is elasticity of demand?", back: "The responsiveness of quantity demanded to a change in price." },
    { front: "Define equilibrium price.", back: "The price at which quantity demanded equals quantity supplied." },
    { front: "What is fiscal policy?", back: "Government use of taxation and spending to influence the economy." },
    { front: "Define monetary policy.", back: "Central bank actions on money supply and interest rates to manage the economy." },
  ],
  "PSY 136": [
    { front: "Define psychology.", back: "The scientific study of behaviour and mental processes." },
    { front: "What is operant conditioning?", back: "Learning where behaviour is shaped by consequences (reinforcement and punishment). Associated with Skinner." },
    { front: "Name Freud's three parts of personality.", back: "Id (instincts), Ego (reality), Superego (morality)." },
    { front: "What is cognitive dissonance?", back: "Mental discomfort from holding two conflicting beliefs or attitudes (Festinger)." },
    { front: "Define perception.", back: "The process of organising and interpreting sensory information to give it meaning." },
  ],
  "GST 112": [
    { front: "When did Nigeria gain independence?", back: "1st October 1960, from the United Kingdom." },
    { front: "Three major ethnic groups in Nigeria?", back: "Hausa, Igbo and Yoruba." },
    { front: "When was Abuja made the capital?", back: "1991 (officially declared capital, replacing Lagos)." },
    { front: "Name two pre-colonial Nigerian kingdoms.", back: "Examples: Oyo Empire, Benin Kingdom, Sokoto Caliphate, Kanem-Bornu." },
    { front: "What does 'federalism' mean for Nigeria?", back: "Power is shared between a central government and 36 component states plus the FCT." },
  ],
};