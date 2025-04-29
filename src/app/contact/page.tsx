export default function ContactPage() {
  return (
    <section className="p-10">
      <h1 className="text-4xl font-bold">Contact Me</h1>
      <form className="flex flex-col gap-4 max-w-md">
        <input className="p-2 border" type="text" placeholder="Name" />
        <input className="p-2 border" type="email" placeholder="Email" />
        <textarea className="p-2 border" placeholder="Message" />
        <button className="bg-black text-white py-2">Send</button>
      </form>
    </section>
  );
}
