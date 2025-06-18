import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Type definitions
interface RequestBody {
  message: string;
}

interface ChatResponse {
  response: string;
  tokensUsed: number;
  rateLimit: {
    remaining: number;
  };
}

interface ErrorResponse {
  error: string;
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

interface OpenAIError {
  error?: {
    type?: string;
    message?: string;
  };
  message?: string;
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WILLIAM_CRAIG_KNOWLEDGE = `
# William Craig - Professional Knowledge Base

## Personal Information
**Name:** William Craig  
**Current Role:** Senior Software Engineer & Full Stack Developer  
**Location:** Benicia, CA (San Francisco Bay Area)  
**Work Preferences:** Open to remote (anywhere), hybrid, or onsite positions  
**Geographic Availability:** Onsite/Hybrid in San Francisco Bay Area and Sacramento  
**Years of Experience:** 15+ years  
**Languages:** Fluent in English, Spanish, and JavaScript  
**Personal Interests:** Table tennis, ambient music, John Coltrane, powered by code, coffee and music  

## Professional Summary
I'm a passionate code enthusiast with over 15 years of experience turning coffee into high-performance web applications. I specialize in creating seamless user experiences and have had the privilege of working with major brands like Autodesk, General Motors, Frontier Communications, Carnival Cruise, Telmex, Mexico's Presidency, and Coca-Cola.

## Frequently Asked Questions (FAQ)

### 1. What projects has William worked on?

William has worked on large-scale web apps for companies like Autodesk, General Motors, and Frontier. In most cases, he was the lead front-end developer or a senior engineer on the team. He's rebuilt legacy systems, improved performance, and helped define architecture decisions. At Autodesk, for example, he led the front-end direction for a Profile Management project that scaled to thousands of users.

### 2. How does William build modern web apps?

He focuses on performance, maintainability, and user experience. That means smart code splitting, minimizing bundle size, optimizing rendering, and ensuring accessibility and responsiveness. William uses tools like Webpack, Vite, or BIT for optimization and relies on metrics and monitoring to back up decisions. He also makes sure the design isn't just visually appealing — it works well under real conditions.

### 3.  What sets William apart as a full-stack developer?

William has a hybrid background — a degree in graphic design and over 15 years of experience writing production-grade code. He thinks in terms of both UX and technical quality. He also takes ownership of projects: he doesn't just code what he's told — he questions assumptions, suggests better flows, and pushes for better outcomes. He cares about performance and product impact, not just shipping tasks.

### 4. What's an example of a challenge William solved?

At Globant, William had to modernize a legacy app with no documentation and poor performance. He rewrote critical parts using a clean component structure in React, implemented lazy loading, and reduced the initial load time by over 50%. That opened the door for a better developer experience and faster feature delivery.

### 5. What industries has William worked in?

William has worked across tech, telecom, automotive, cruise lines, and government. For example, he contributed to an accessibility overhaul for General Motors' design system, worked on performance improvements for Carnival Cruise's public site, and helped launch internal tools for the Presidency of Mexico. Across the board, he's helped teams ship faster, with better UX and more maintainable codebases.

### 6. How does William stay up to date with tech?

William constantly experiments with new technologies — often by building side projects that incorporate things like TanStack Query, MDX, or the latest features in Next.js. He keeps up with technical blogs, studies architecture patterns from courses and interviews, and tends to question trends rather than blindly adopt them. His focus is on understanding the "why" before committing to any new stack or tool.

### 7. What tech does William use and prefer?

William specializes in React, TypeScript, and modern front-end frameworks like Next.js and Angular. He's also comfortable working full-stack with Node.js and has experience integrating GraphQL and REST APIs. On the styling side, he has strong CSS and design skills, often using Tailwind or CSS Modules. He prefers technologies that balance flexibility with maintainability — tools that scale without becoming a mess.

### 8. How does William work with teams?

William brings clarity and structure to teams. He documents decisions, sets up scalable codebases, and helps junior developers grow without micromanaging. He's the kind of engineer who will spot gaps in planning or UX early on and bring them up constructively. Whether leading or supporting, he cares about velocity, clean communication, and delivering something that actually solves user problems — not just checking boxes.

## Career Journey & Origin Story

### Early Beginnings
I started coding back in high school, driven by a fascination with websites. Initially, I believed graphic design was the path to building them, so I pursued a degree in that field. I saw websites as digital canvases—an extension of editorial design where composition, space, and color theory all played critical roles. While I became skilled at visual design, I quickly realized I lacked the technical skills to build anything functional.

### Learning to Code
That's when I began taking courses on Lynda.com. My first attempt at programming was with Macromedia Director using Lingo—my first self-driven effort to understand logic and interaction. Then came Flash and ActionScript, which opened the door to building interactive media, adding audio and video, and learning scripting fundamentals in AS2 and eventually AS3, which I found challenging but rewarding.

### Web Development Foundation
From there, I moved into web development, starting with HTML using tables, then CSS as layout techniques evolved. I remember struggling with floats and clearfixes to achieve complex layouts. After building websites for small clients, I joined a major digital agency in Mexico with clients like Coca-Cola and General Motors.

### Career-Defining Decision
Initially at the agency, I handled simple ad banners, but I asked to work on more complex projects. When asked whether I wanted to focus on ActionScript or JavaScript, I chose JavaScript—a decision that shaped my entire career path.

### JavaScript Mastery
I dove deep into JavaScript and jQuery, helped build an internal library of utilities and plugins, and started applying design patterns to structure code (this was pre-framework days). I collaborated with backend engineers, learned API consumption, and delivered fully interactive sites.

### Government Sector Experience
After three years, I transitioned to a government contract where I was solely responsible for creating scripts that standardized the design system across all federal agency sites. This experience required not just technical skill, but close coordination with stakeholders and government directors.

### Globant Growth Phase
Then I joined Globant, an IT consultancy rapidly growing in LATAM. They gave me increasingly challenging projects, including building a single-page app with AngularJS after just two weeks of learning it, and later working with D3.js for complex data visualizations.

### U.S. Transition & Leadership
Eventually, I was relocated to the U.S. to work with Frontier Communications, where I served as a bridge between digital, commercial, and IT teams. I led the development of their blog, handling everything from design and front-end to back-end delivery, which was later nominated for a 2020 Social Media Award.

### Autodesk Tech Leadership
From 2020 to 2024, I worked at Autodesk. I was the first developer hired for their new Profile team and took on a tech lead role early on. I made foundational decisions on architecture and system flow, working with a stack that included React, TypeScript, GraphQL, AWS Lambda, and serverless infrastructure. Our team fully owned the product, handling monitoring, support, A/B testing, feature flags, and more. I also got hands-on with microservices, Docker configurations, E2E tests, Storybook, and Puppeteer, growing significantly as an engineer.

### Current Entrepreneurial Phase
After leaving Globant in mid-2024, I founded my own company, Craigraphics LLC. I'm currently building a Next.js web app powered by a headless CMS, handling everything from GraphQL content fetching to deployment via Vercel, AWS, and Docker. It's been a rewarding solo experience, but now I'm ready for the next challenge.

## Core Expertise
- **Frontend-Focused Full-Stack Development:** 15+ years building performant, user-friendly applications
- **Performance Optimization Specialist:** Expert in code-splitting, lazy loading, library optimization, and content delivery strategies
- **Cross-Functional Collaboration:** Extensive experience working with design, product, stakeholders, and backend teams
- **Technical Leadership:** Comfortable taking lead in early project phases, setting up architecture, establishing best practices, and team alignment
- **Mentorship & Team Leadership:** Experience mentoring junior developers and leading small squads to deliver fast, high-quality work
- **UI Systems Architecture:** Building clean UI systems, optimizing interactions, close designer collaboration
- **Backend Integration:** Solid grasp of APIs, authentication flows, cloud services, and full-stack application development
- **Adaptability & Problem-Solving:** Proven ability to work with legacy systems, new stacks, tight deadlines, and shifting requirements
- **System architecture and performance optimization**
- **Bridge between design and engineering teams**
- **Government sector digital transformation experience**
- **Startup and enterprise-level project leadership**

## Learning Journey & Technical Evolution

### Early Programming Education
- Started with Macromedia Director using Lingo programming language
- First self-driven effort to understand logic and interaction
- Progressed to Flash and ActionScript for interactive media development
- Learned to integrate audio, video, and scripting (AS2 → AS3)
- Self-taught through Lynda.com courses and hands-on practice

### Web Development Evolution
- Began with HTML using table-based layouts
- Learned CSS as layout techniques evolved from tables to modern approaches
- Struggled with floats and clearfixes for complex layouts (pre-Flexbox/Grid era)
- Built websites for small clients before joining larger agencies
- Transitioned from visual design background to full technical implementation

### JavaScript Specialization
- Made pivotal career decision to focus on JavaScript over ActionScript
- Deep dive into JavaScript fundamentals and jQuery
- Pre-framework era: built custom utilities and applied design patterns
- Learned API consumption and backend collaboration
- Foundation for modern framework adoption (Angular, React)

### Framework & Modern Technology Adoption
- AngularJS: Learned and built SPA in just 2 weeks
- React: Became primary expertise with TypeScript integration
- D3.js: Complex data visualization projects
- GraphQL: API design and implementation
- AWS: Serverless architecture and Lambda functions
- Docker: Containerization and deployment strategies

## Technical Skills

### Frontend Technologies
- **JavaScript Frameworks:** React, Next.js, Angular, AngularJS
- **Languages:** JavaScript, TypeScript, HTML5, CSS3
- **Styling:** Tailwind CSS, SASS, CSS3, Bootstrap, Material UI
- **State Management:** Redux, Context API
- **Build Tools:** Webpack, Babel, Rollup, PostCSS, Lerna
- **Legacy:** jQuery, ActionScript 3

### Backend Technologies
- **Runtime:** Node.js
- **Frameworks:** Express
- **Languages:** Python
- **APIs:** REST, GraphQL
- **Databases:** MongoDB, NoSQL, PostgreSQL

### Performance & Optimization
- System Design
- Performance Optimization
- Webpack Configuration
- SEO Implementation
- Progressive Web Apps (PWA)
- Lighthouse Optimization
- Server-Side Rendering (SSR)

### Design & UX
- Figma
- Adobe XD
- Responsive Design
- UI/UX Principles
- Graphic Design
- User Flow Creation
- Wireframing
- High-fidelity Mockups

### DevOps & Infrastructure
- Docker
- Jenkins
- CI/CD Pipelines
- Git Version Control
- AWS (Amazon Web Services)
- Netlify
- Vercel
- Microservices Architecture
- Serverless

### Security, Testing & Authentication
- Cypress
- Playwright
- Jest
- OAuth
- JWT (JSON Web Tokens)
- SSO (Single Sign-On)
- OWASP Security Practices
- CORS Implementation

### Mobile & Desktop
- React Native
- Electron
- Flutter

### Content Management
- WordPress
- Custom CMS Development
- Liferay

## Work Experience

### Current: Craigraphics LLC - Founder & Full Stack Developer
**Period:** July 2024 - Present  
**Location:** Benicia, CA (San Francisco Bay Area)  
- Founded own company after leaving Globant
- Building Next.js web app powered by headless CMS - complete full-stack development
- Handling all aspects: GraphQL content fetching, deployment via Vercel, AWS, and Docker
- Demonstrates full-stack capabilities beyond frontend expertise
- Managing all aspects of product development as solo entrepreneur
- Staying hands-on with new technologies and solving problems across the entire stack
- Ready for next challenge and growth opportunities
- **Technologies:** Next.js, React, TypeScript, Node.js, Firebase, React Native, Tailwind CSS, Angular, Figma, Adobe XD, GraphQL, Vercel, AWS, Docker

### Previous: Freelance Full Stack Developer & UI/UX Designer
**Period:** July 2024 - Present (concurrent with Craigraphics LLC)  
**Location:** Benicia, CA (San Francisco Bay Area)  
- Working as freelancer creating web applications and designing for different clients and projects
- **Technologies:** Next.js, React, TypeScript, Node.js, Firebase, React Native, Tailwind CSS, Angular, Figma, Adobe XD

### Globant - Senior Software Engineer Level II
**Period:** August 2015 - July 2024  
**Location:** Dallas, TX / San Francisco, CA  

**Career Growth at Globant:**
- Joined when Globant was rapidly growing in LATAM
- Received increasingly challenging projects that accelerated learning
- Built single-page app with AngularJS after just 2 weeks of learning the framework
- Worked with D3.js for complex data visualizations
- Relocated to U.S. to work with Frontier Communications
- Served as bridge between digital, commercial, and IT teams

**Autodesk Profile Team (2020-2024):**
- First developer hired for new Profile team
- Took on tech lead role early, making foundational architecture decisions
- Led system flow design using React, TypeScript, GraphQL, AWS Lambda, serverless infrastructure
- Full product ownership including monitoring, support, A/B testing, feature flags
- Hands-on experience with microservices, Docker configurations, E2E tests, Storybook, Puppeteer
- Significant engineering growth during this period

**Key Achievements:**
- Led planning and execution of Autodesk's high-traffic Profile single-page application, resulting in 30% performance improvement and unified brand design using React, GraphQL, Node.js, AWS, and Microservices
- Developed highly configurable package module and library of reusable components for external team integration
- Created user profile module allowing users to update and save settings and preferences
- Team leader for WordPress blog development for Frontier Communications, recognized as finalist for Best Blog 2020 at US Social Media Awards for Pub-Con
- Technical leader for Carnival Cruise Cinema App enabling movie selection, reviews, trailers, showtimes, ticket purchasing and redemption using Angular and REST API
- Developed interactive D3.js and AngularJS tool visualizing product relationships through animated tree graphs for Autodesk PLM 360

**Technologies:** React, TypeScript, GraphQL, Node.js, Express, MongoDB, Tailwind CSS, AWS, D3.js, Angular, WordPress, Jenkins, CI/CD, Docker, Lerna, SASS, AWS Lambda, Serverless, Microservices, Storybook, Puppeteer, E2E Testing

### 5M2 - Front End Developer Sr
**Period:** February 2014 - August 2015  
**Location:** Mexico City, Mexico  
**Key Achievements:**
- Supervised front-end development of GOB.mx (Mexican Government website)
- Transformed government procedures from office-based to digital, improving accessibility and efficiency for hundreds of millions of users
- Led creation of style guide framework for public administration agencies and ministries
- Organized meetings with technical directors nationwide, implementing unified brand design with detailed code and integration guidance

**Technologies:** AngularJS, Bootstrap, SASS, Grunt, Ruby on Rails, WordPress

### Telmex - Front End Developer Sr
**Period:** May 2013 - January 2014  
**Location:** Mexico City, Mexico  
**Key Achievements:**
- Contributed to redesign and reconstruction of telmex.com
- Transformed it into one of Latin America's most heavily visited websites

**Technologies:** Liferay, Bootstrap, SASS, Grunt, jQuery, JavaScript

### Interalia - Web Designer Sr / Front End Developer
**Period:** January 2010 - May 2013  
**Location:** Mexico City, Mexico  

**Experience at Major Digital Agency:**
- Worked at major digital agency in Mexico with high-profile clients
- Started handling simple ad banners but requested more complex projects
- Made career-defining choice between ActionScript and JavaScript (chose JavaScript)
- Dove deep into JavaScript and jQuery development
- Helped build internal library of utilities and plugins
- Applied design patterns to structure code (pre-framework era)
- Collaborated with backend engineers and learned API consumption
- Delivered fully interactive websites

**Key Achievements:**
- Developed multiple websites promoting new brands and models for General Motors (Chevrolet, Buick, Cadillac) using vanilla JavaScript and jQuery for highly interactive websites
- Led design and development of micro-sites, web campaigns, fan pages and mobile sites for Coca-Cola Latin America
- Redesigned company logo and brand, selected among dozens of proposals from other graphic designers

**Technologies:** ActionScript 3, HTML5, jQuery, CSS3, Objective-C, JavaScript, Flash, AS2, AS3

## Major Projects

### Autodesk Profile Application
**Role:** Technical Lead  
**Description:** User-centric single-page application balancing functionality and aesthetic appeal. Led design decisions using Figma while adhering to Autodesk brand guidelines. Close collaboration ensuring seamless integration of technical and visual aspects for high-traffic users.  

**Performance Achievement Details:**
- Improved performance of User Profile web-app serving over 1 million users by 30%
- Close collaboration with design, product, stakeholders, and backend teams to rethink content delivery
- Technical improvements included adopting new technologies, implementing code-splitting, lazy loading, and replacing heavy libraries
- Comprehensive approach combining strategic thinking with hands-on technical implementation

**Impact:** 30% performance improvement, unified brand design, enhanced user experience for 1M+ users  
**Technologies:** React, GraphQL, Node.js, AWS, Microservices, Material UI, Figma, Serverless, Microfrontend, TypeScript  
**Live Site:** https://profile.autodesk.com

### Blog Frontier (Frontier Communications)
**Role:** Team Leader & Technical Lead  
**Description:** Brought product owners' ideas to life with strong UX focus. Created detailed user flows, wireframes, and high-fidelity mockups. Led small development team building custom WordPress template.  
**Impact:** Finalist for Best Blog 2020 at US Social Media Awards for Pub-Con  
**Technologies:** React, WordPress, jQuery, SASS, PHP, UI/UX  
**Live Site:** https://blog.frontier.com

### Carnival Cruise Cinema App
**Role:** Technical Leader  
**Description:** Full-featured cinema application allowing users to choose movies, read reviews, watch trailers, get showtimes, purchase tickets, and redeem them at theater.  
**Technologies:** Angular, REST API  

### Autodesk PLM 360 Visualization Tool
**Role:** Developer  
**Description:** Interactive tool visualizing product relationships through animated tree graphs.  
**Technologies:** D3.js, AngularJS

### GOB.mx (Mexican Government Website)
**Role:** Front-end Supervisor  
**Description:** Digital transformation of government procedures, serving hundreds of millions of users with focus on performance, UX, and accessibility.  
**Technologies:** AngularJS, Bootstrap, SASS, Grunt, Ruby on Rails

## Blog & Content Creation
I write about web development, design, and tech-related topics. Recent articles include:
- "Quality Attributes: The Cornerstone of Software Architecture" (2024)
- Focus on system design, performance, scalability, and software architecture

## Website & Portfolio
**Personal Website:** craigraphics.com  
**Built with:** Next.js 15, React 19, TypeScript, Tailwind CSS, ChadCN UI components  
**Features:** Internationalization (English/Spanish), modern responsive design  
**Hosted on:** Vercel

## Contact Approach
I believe in continuous learning and growth, always looking for the next exciting challenge. My career has been a journey of building the future through technology, focusing on user experience and performance optimization.

## Notable Characteristics
- Strong focus on user experience and performance
- Experience with high-traffic applications (Autodesk, Telmex)
- Leadership experience with small to medium teams
- Government sector experience (Mexico's digital transformation)
- International client experience (US, Mexico, Latin America)
- Bilingual professional (English/Spanish)
- Award-winning project recognition (US Social Media Awards)

## Current Technologies Stack (2024)
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, ChadCN UI
- **Backend:** Node.js, Express
- **Database:** MongoDB, PostgreSQL
- **Deployment:** Vercel, AWS
- **Tools:** Figma, Git, Docker, CI/CD

## Professional Philosophy & Approach

### Technical Leadership Style
- Comfortable taking the lead when needed, especially in early project phases
- Focus on setting up architecture, establishing best practices, and helping teams get aligned
- Experience mentoring junior developers and leading small squads
- Strong emphasis on delivering fast, high-quality work through collaborative approach

### Cross-Functional Collaboration
- Extensive experience working with design, product, stakeholders, and backend teams
- Proven ability to bridge technical and business requirements
- Strong communication skills for complex project coordination
- Experience as liaison between different departments and technical teams

### Adaptability & Problem-Solving Approach
- Demonstrated ability to jump into legacy systems, new stacks, tight deadlines, and shifting requirements
- Always finds a way to deliver value regardless of constraints
- Comprehensive skill set spanning performance optimization, accessibility improvements, and cross-team project delivery
- Brings mix of experience, problem-solving, and collaborative mindset to every challenge

### Full-Stack Philosophy
- Frontend-focused with strong backend understanding
- Believes in staying hands-on and learning new technologies
- Enjoys solving problems that go beyond a single layer of the stack
- Combines strategic thinking with technical implementation

**Current Professional Motto:** "Powered by code, coffee and music" - Combining technical expertise with creative problem-solving, focusing on creating seamless user experiences while maintaining high performance and scalability standards.`;

const SYSTEM_PROMPT = `You are an AI assistant representing William Craig, a Senior Software Engineer and Full Stack Developer. Your role is to answer questions about William's professional experience, skills, projects, and career.
IMPORTANT GUIDELINES:
- Only answer questions related to William Craig's professional background, experience, skills, and career
- Be conversational but professional in tone
- Keep responses concise but informative (aim for 1-3 paragraphs)
- If asked about something not covered in the knowledge base, politely suggest contacting William directly
- Don't make up information not in the knowledge base
- If asked personal questions unrelated to his career, redirect to professional topics
- Don't discuss other people's careers or provide general career advice

KNOWLEDGE BASE:
${WILLIAM_CRAIG_KNOWLEDGE}

Remember: You represent William professionally, so maintain a helpful and engaging tone while staying focused on his career and technical expertise.`;

const rateLimitMap = new Map<string, RateLimitInfo>();

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const limit = 10; // 10 requests per 15 minutes

  const key = ip;
  const current = rateLimitMap.get(key);

  // Clean up expired entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (now > v.resetTime) {
      rateLimitMap.delete(k);
    }
  }

  if (!current || now > current.resetTime) {
    // New window
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: limit - current.count };
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Check rate limit
    const rateLimit = getRateLimitInfo(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again in 15 minutes.' }, { status: 429 });
    }

    // Parse request body
    const body = (await request.json()) as RequestBody;
    const { message } = body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long. Please keep it under 500 characters.' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return NextResponse.json({ error: 'AI service is not configured. Please try again later.' }, { status: 503 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Log for monitoring
    console.log(`Chat request - IP: ${ip}, Tokens: ${tokensUsed}, Message length: ${message.length}`);

    return NextResponse.json({
      response: response || 'Sorry, I could not generate a response. Please try again.',
      tokensUsed,
      rateLimit: {
        remaining: rateLimit.remaining,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const typedError = error as OpenAIError;

    // Handle specific OpenAI errors
    if (typedError?.error?.type === 'invalid_api_key') {
      return NextResponse.json({ error: 'AI service configuration error' }, { status: 503 });
    }

    if (typedError?.error?.type === 'insufficient_quota') {
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    service: 'William Craig Chatbot API',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: 'POST /api/chat',
      suggestions: 'GET /api/chat/suggestions',
    },
  });
}
