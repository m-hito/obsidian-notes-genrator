export interface SampleItem {
  id: string;
  name: string;
  badge: string;
  title: string;
  sourceUrl: string;
  preset: 'technical' | 'conceptual' | 'auto';
  transcript: string;
}

export const SAMPLES: SampleItem[] = [
  {
    id: "sample-react",
    name: "React + Tailwind (Vite Setup)",
    badge: "Technical Code Guide",
    title: "Installing Tailwind CSS with React (Vite)",
    sourceUrl: "https://tailwindcss.com/docs/installation/using-vite",
    preset: "technical",
    transcript: `Hey everyone! In this lecture we are going to set up Tailwind CSS in a brand new React project using Vite.
First off, open your terminal and let's create a new Vite project directly in the current directory. You can run npm create vite@latest dot. The dot at the end means use the current folder instead of creating a nested directory.
When prompted for options, select React as the framework and JavaScript or TypeScript as the variant.
Next, let's install Tailwind CSS. With Tailwind v4, we install two packages: npm install tailwindcss and @tailwindcss/vite. @tailwindcss/vite is the official Vite plugin for Tailwind CSS that handles compilation behind the scenes.
Now open up your vite.config.js file. We need to import tailwindcss from @tailwindcss/vite and add tailwindcss() inside the plugins array alongside react().
Next step: go into src/index.css. Delete whatever default boilerplate CSS is there and simply put @import "tailwindcss"; at the very top. This single line loads all the generated utility classes across your React application.
Now you can start the development server by running npm run dev. Vite will launch the dev server with Hot Module Replacement on localhost:5173.
Let's test it out. In App.jsx, replace the component content with a simple h1 that has className="text-4xl font-bold text-blue-600". If you save the file, you'll immediately see the bold blue text rendered!
Remember: in React always use className instead of class. If you find a utility class isn't applying, check dev tools because custom CSS rules in index.css might override utility classes if specificity is higher.`,
  },
  {
    id: "sample-genai",
    name: "AI-Assisted App Planning",
    badge: "Conceptual Framework",
    title: "AI-Assisted App Planning & Building",
    sourceUrl: "https://ai.google.dev/study/vibe-coding-architecture",
    preset: "conceptual",
    transcript: `Welcome to this module on AI-Assisted software design. Today we're breaking down a huge pitfall people face when "vibe coding".
The core idea is simple: Plan with AI before you vibe code. You should use Gemini as a thoughtful partner to gather requirements, challenge assumptions, and produce a crisp specification doc or build prompt, rather than jumping straight into generating thousands of lines of messy code from a single vague sentence.
Let's talk about key concepts. First, Requirements Gathering: before building anything, have a back-and-forth discussion with the model about the real problem and what edge cases might exist.
Second, the Spec Doc: this is a structured blueprint outlining the exact features, UI expectations, user flows, and technical constraints.
Third, Context: never rely on generic LLM knowledge when you have real project documents. Give Gemini your actual project charter, schema definitions, or spreadsheet plans so the generated solution reflects real business reality.
Fourth, Constraints: explicit boundaries like "do not create external databases" or "use single-view layout" keep the AI disciplined and stop hallucinated feature creep.
Here is the 8-step framework:
1. Describe the problem clearly to Gemini.
2. Explore alternative architectural approaches and challenge the ones you dislike.
3. Refine requirements through iterative dialogue.
4. Create the build prompt or spec document.
5. Add relevant project context and ask what's missing.
6. Incorporate discoveries back into the build prompt.
7. Build with real project data.
8. Test and validate the generated prototype.
Practical tips: challenge the AI's first draft, avoid massive wall-of-text prompts by focusing on clear constraints, and always treat generated code as a prototype that requires verification.
Remember the workflow: Problem to AI discussion to Requirements to Spec to Context to Real Data to Build to Test.`,
  },
  {
    id: "sample-system-design",
    name: "Distributed Caching (Redis vs Memcached)",
    badge: "System Design & Arch",
    title: "Distributed Caching Strategies & Architecture",
    sourceUrl: "https://systemdesignprimer.internal/caching",
    preset: "technical",
    transcript: `In this lecture on system design, we explore distributed caching to reduce database read load and lower p99 latency.
There are two primary distributed cache engines used in production: Redis and Memcached.
Redis is single-threaded with an event loop, supports complex data structures (hashes, sorted sets, lists, bitmaps), pub/sub, Lua scripting, and persistence via RDB snapshots and AOF logs.
Memcached is multi-threaded, highly performant for simple key-value lookups with string/binary blobs, but lacks persistence and native data structure manipulation.
When designing the caching pattern, you have three primary architectural choices:
1. Cache-Aside (Lazy Loading): The application first checks the cache. On a cache miss, it queries the database, writes the result to the cache with a TTL, and returns it. Best for read-heavy workloads where cache misses are acceptable.
2. Write-Through: The application writes data to the cache, and the cache synchronously writes to the database before acknowledging. Guarantees consistency but adds write latency.
3. Write-Behind (Write-Back): The application writes directly to the cache, which acknowledges immediately and asynchronously flushes batches to the database. High write throughput, but risks data loss if the cache node crashes before flush.
For eviction policies, always configure LRU (Least Recently Used) or LFU (Least Frequently Used) with memory limits (maxmemory in redis.conf).
Watch out for the Thundering Herd / Cache Stampede problem: when a popular key expires, thousands of simultaneous queries hit the database at once. Mitigate this with mutex locking (single-flight) or probabilistic early expiration.`,
  },
];
