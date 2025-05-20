function TheorySection() {
  return (
    <div className="theory-section">
      <h2>🧠 Page Replacement & Algorithms</h2>

      <section>
        <h3>📄 What is Paging?</h3>
        <p>
          Paging is a memory management technique in modern operating systems
          that eliminates the need for contiguous memory allocation. It divides
          processes into fixed-size blocks called <strong>pages</strong> and
          physical memory into <strong>frames</strong>. Pages are loaded into any
          available frame, and the system keeps track of where each page resides
          using a page table.
        </p>
        <p>
          When a required page is not in memory (called a{" "}
          <strong>page fault</strong>), the system must load it from disk,
          possibly replacing an existing one using a page replacement algorithm.
        </p>
      </section>

      <section>
        <h3>🔁 FIFO – First-In-First-Out</h3>
        <p>
          FIFO is the simplest page replacement algorithm. It maintains a
          queue of pages in memory and replaces the page that has been in
          memory the longest, regardless of how often it has been accessed.
        </p>
        <p>
          <strong>Pros:</strong> Simple to implement. <br />
          <strong>Cons:</strong> Poor performance in some scenarios (e.g., Belady's anomaly).
        </p>
      </section>

      <section>
        <h3>🕒 LRU – Least Recently Used</h3>
        <p>
          LRU replaces the page that hasn't been used for the longest period of
          time. It assumes that pages used recently will likely be used again
          soon, and pages that haven't been used are less likely to be reused.
        </p>
        <p>
          <strong>Pros:</strong> Performs better than FIFO in many cases. <br />
          <strong>Cons:</strong> Needs tracking of usage history, which adds complexity.
        </p>
      </section>

      <section>
        <h3>📊 MRU – Most Recently Used</h3>
        <p>
          MRU is the opposite of LRU. It assumes that pages accessed recently
          are least likely to be accessed again soon. It replaces the most
          recently used page during a page fault.
        </p>
        <p>
          <strong>Use Case:</strong> Works well when programs exhibit sequential access patterns.
        </p>
      </section>

      <section>
        <h3>🎯 Optimal (OPT)</h3>
        <p>
          The Optimal algorithm replaces the page that will not be used for the
          longest time in the future. It gives the best possible page fault rate.
        </p>
        <p>
          <strong>Limitation:</strong> It requires future knowledge of page references,
          so it's mainly used for benchmarking.
        </p>
      </section>
    </div>
  );
}

export default TheorySection;

