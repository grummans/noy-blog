# GrummansBlog - Vue 3 Blog

A modern, responsive blog built with Vue 3, TypeScript, and Tailwind CSS. This project demonstrates best practices for building scalable Vue applications with a focus on performance, accessibility, and developer experience.

## ✨ Features

- **Vue 3 & TypeScript**: Built with the latest Vue 3 Composition API and full TypeScript support
- **Modern Styling**: Tailwind CSS with dark/light theme support
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Blog Functionality**: Post management, tagging, search, and filtering
- **Performance Optimized**: Fast loading with Vite build tool
- **Accessibility**: WCAG compliant with semantic HTML and proper ARIA attributes
- **SEO Ready**: Structured for search engine optimization

## 🚀 Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Build Tool**: Vite
- **Router**: Vue Router 4
- **Utilities**: VueUse, date-fns
- **Icons**: Heroicons (via SVG)

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.vue      # Navigation header
│   └── Footer.vue      # Site footer
├── views/              # Page components
│   ├── Home.vue        # Homepage
│   ├── Posts.vue       # Posts listing
│   ├── Post.vue        # Individual post
│   ├── About.vue       # About page
│   ├── Tags.vue        # Tags overview
│   └── Search.vue      # Search functionality
├── router/             # Vue Router configuration
└── assets/             # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd grummans-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Theme Configuration

The project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      },
      typography: {
        // Customize typography styles
      }
    }
  }
}
```

### Adding Blog Posts

Currently, posts are stored as JavaScript objects in the view components. In a production environment, you would typically:

1. Store posts in a headless CMS (Strapi, Contentful, etc.)
2. Use markdown files with frontmatter
3. Connect to a REST API or GraphQL endpoint

Example post structure:
```javascript
{
  slug: 'post-slug',
  title: 'Post Title',
  description: 'Post description',
  content: '<p>HTML content</p>',
  tags: ['Vue', 'TypeScript'],
  pubDate: '2024-01-15T00:00:00Z',
  readTime: 8
}
```

## 🚀 Deployment

This project can be deployed to any static hosting platform:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: For scalable cloud hosting

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools

---

Built with ❤️ using Vue 3, TypeScript, and Tailwind CSS
