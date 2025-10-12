import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata = {
  title: "Blog | ReelHaus",
  description: "Stay updated with the latest news, insights, and stories from the ReelHaus community.",
}

const blogPosts = [
  {
    id: 1,
    title: "The Future of Club Events: Trends to Watch in 2024",
    excerpt: "Discover the emerging trends that are shaping the future of club events and nightlife experiences.",
    author: "Alex Chen",
    date: "2024-01-15",
    category: "Industry Insights",
    readTime: "5 min read",
    image: "/placeholder.jpg"
  },
  {
    id: 2,
    title: "Building Community Through Shared Experiences",
    excerpt: "How ReelHaus creates meaningful connections and lasting friendships through our curated events.",
    author: "Sarah Johnson",
    date: "2024-01-10",
    category: "Community",
    readTime: "4 min read",
    image: "/placeholder.jpg"
  },
  {
    id: 3,
    title: "Behind the Scenes: Planning the Perfect Event",
    excerpt: "Take a look at the meticulous planning and attention to detail that goes into every ReelHaus event.",
    author: "Marcus Rodriguez",
    date: "2024-01-05",
    category: "Behind the Scenes",
    readTime: "6 min read",
    image: "/placeholder.jpg"
  },
  {
    id: 4,
    title: "Member Spotlight: Stories from Our Community",
    excerpt: "Hear from our members about their favorite ReelHaus experiences and the memories they've created.",
    author: "Emma Thompson",
    date: "2024-01-01",
    category: "Member Stories",
    readTime: "3 min read",
    image: "/placeholder.jpg"
  },
  {
    id: 5,
    title: "Music and Technology: The Perfect Fusion",
    excerpt: "Exploring how technology is enhancing musical experiences in modern club environments.",
    author: "David Kim",
    date: "2023-12-28",
    category: "Technology",
    readTime: "7 min read",
    image: "/placeholder.jpg"
  },
  {
    id: 6,
    title: "Sustainable Events: Our Commitment to the Environment",
    excerpt: "Learn about ReelHaus's initiatives to make our events more sustainable and environmentally friendly.",
    author: "Lisa Wang",
    date: "2023-12-25",
    category: "Sustainability",
    readTime: "5 min read",
    image: "/placeholder.jpg"
  }
]

const categories = ["All", "Industry Insights", "Community", "Behind the Scenes", "Member Stories", "Technology", "Sustainability"]

export default function BlogPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            ReelHaus Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Stories, insights, and updates from the world of exclusive club events and experiences.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`px-4 py-2 cursor-pointer transition-all ${
                  category === "All" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                    : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">Featured Article</h2>
          <Card className="glass-border-enhanced overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                  {blogPosts[0].category}
                </Badge>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{blogPosts[0].title}</h3>
                <p className="text-gray-300 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>By {blogPosts[0].author}</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <Link 
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all"
                >
                  Read More
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="glass-border-enhanced overflow-hidden hover:scale-105 transition-transform">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <Badge className="mb-3 border-yellow-400 text-yellow-400">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>By {post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-yellow-400 hover:text-yellow-300 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest blog posts, event updates, and exclusive content.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
