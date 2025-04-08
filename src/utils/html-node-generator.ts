export const htmlNodeGenerator = (name: string) => {
	return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="w-full h-screen flex items-center justify-center bg-blue-500 text-white p-10 text-center rounded-lg shadow-lg">
          <div>
            <h1 class="text-4xl font-bold">Hello, ${name}!</h1>
            <p class="mt-4 text-lg">This is a sample image generated from HTML with Tailwind.</p>
          </div>
        </div>
      </body>
    </html>
	`;
};
