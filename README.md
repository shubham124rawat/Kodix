# Kodix - AI Code Assistant

Kodix is an AI-powered code generation and debugging assistant built with Next.js and Groq Cloud API running Llama 3.3 70B. It helps developers generate code, debug broken code, explain complex logic, and optimize performance.

## 🚀 Live Demo

Check out the live application: [https://kodix-topaz.vercel.app/](https://kodix-topaz.vercel.app/)

## ✨ Features

- **Code Generation**: Generate clean, readable code in multiple programming languages
- **Code Debugging**: Debug broken code with detailed explanations
- **Code Explanation**: Get plain English explanations of complex code
- **Code Optimization**: Optimize code for better performance
- **Real-time Streaming**: Watch code generate in real-time
- **History**: Save and restore previous generations
- **Multiple Languages**: Support for Python, JavaScript, TypeScript, Java, C++, and more

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **AI**: Groq Cloud API (`llama-3.3-70b-versatile`)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/shubham124rawat/Kodix.git
cd Kodix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file and add your Groq API key:
```env
GROQ_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📝 Usage

1. Select a module (Code Generator, Debugger, Explainer, or Optimizer)
2. Choose your programming language
3. Enter your prompt or paste your code
4. Click "Generate" and watch the AI work its magic

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the MIT License.
