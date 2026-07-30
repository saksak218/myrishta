import { moderationQueues } from "./queues";

export default function DashboardPage() {
  return (
    <main>
      <header>
        <p className="eyebrow">Staff only</p>
        <h1>Moderation console</h1>
        <p className="lede">
          Operational queues will become available as the moderation milestone is implemented.
        </p>
      </header>
      <section aria-label="Moderation queues">
        {moderationQueues.map((queue) => (
          <article key={queue}>
            <h2>{queue}</h2>
            <p>Not configured</p>
          </article>
        ))}
      </section>
    </main>
  );
}
