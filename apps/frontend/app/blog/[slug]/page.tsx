"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Calendar, Clock, Share2, User, Bookmark, Twitter, Facebook, Linkedin, Tag } from "lucide-react";
import BiteBaseLogo from "../../../components/BiteBaseLogo";
import BlogInteractions from "../../../components/blog/BlogInteractions";

interface BlogPostParams {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<any>;
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  
  // Mock data for a single blog post
  const post = {
    title: "10 Essential KPIs Every Restaurant Owner Should Track",
    slug: "essential-restaurant-kpis",
    coverImage: "https://images.unsplash.com/photo-1572715376701-98568319fd0b?q=80&w=2574&auto=format&fit=crop",
    author: {
      name: "Alex Chen",
      avatar: "/team/alex-chen.jpg",
      title: "Restaurant Analytics Specialist"
    },
    publishedAt: "September 15, 2024",
    readingTime: "8 min read",
    tags: ["analytics", "restaurant management", "data"],
    category: "Restaurant Analytics",
    content: `
# 10 Essential KPIs Every Restaurant Owner Should Track

In the competitive restaurant industry, gut instinct and experience alone are no longer enough to ensure success. Restaurant owners who leverage data to make informed decisions consistently outperform their competitors. This article outlines the 10 most important Key Performance Indicators (KPIs) that every restaurant owner should track to optimize operations and maximize profitability.

## Why KPIs Matter for Restaurants

Before diving into specific metrics, it's important to understand why KPIs are so valuable. KPIs provide objective measurements of your restaurant's performance, allowing you to:

- Identify trends and patterns
- Spot problems before they become critical
- Make data-driven decisions
- Set realistic goals and track progress
- Compare performance across time periods or locations

## 1. Cost of Goods Sold (COGS)

**What it is**: The total cost of all ingredients and products used to produce your food and beverage sales.

**Why it matters**: COGS directly impacts your profit margins. By tracking this metric, you can identify opportunities to negotiate better supplier prices, adjust portion sizes, or modify recipes to reduce waste without compromising quality.

**Target range**: 28-32% of total revenue

**How to calculate**: 
\`\`\`
COGS = Beginning Inventory + Purchases - Ending Inventory
\`\`\`

**Pro tip**: Break down COGS by menu category to identify which items are most profitable.

## 2. Labor Cost Percentage

**What it is**: The total cost of labor (including wages, benefits, and taxes) as a percentage of total revenue.

**Why it matters**: Labor typically represents one of the largest expenses for restaurants. Monitoring this KPI helps ensure you're staffing efficiently without compromising service quality.

**Target range**: 25-35% of total revenue

**How to calculate**: 
\`\`\`
Labor Cost Percentage = (Total Labor Cost / Total Revenue) × 100
\`\`\`

**Pro tip**: Analyze labor costs by shift to identify periods of overstaffing or understaffing.

## 3. Prime Cost

**What it is**: The sum of COGS and labor costs.

**Why it matters**: Prime cost combines your two largest variable expenses, providing a comprehensive view of your operational efficiency.

**Target range**: 55-65% of total revenue

**How to calculate**: 
\`\`\`
Prime Cost = COGS + Total Labor Cost
\`\`\`

**Pro tip**: Set progressive targets to reduce prime cost by 1-2% each quarter through incremental improvements.

## 4. Break-Even Point

**What it is**: The amount of revenue needed to cover all expenses with zero profit.

**Why it matters**: Knowing your break-even point helps you set realistic sales goals and understand how much you need to sell to remain profitable.

**How to calculate**: 
\`\`\`
Break-Even Point = Fixed Costs / (1 - (Variable Costs / Revenue))
\`\`\`

**Pro tip**: Calculate your daily break-even point to track whether each day's operations are profitable.

## 5. Average Check Size

**What it is**: The average amount spent per customer.

**Why it matters**: This metric helps you understand customer spending patterns and evaluate the effectiveness of upselling and menu pricing strategies.

**How to calculate**: 
\`\`\`
Average Check Size = Total Revenue / Number of Checks
\`\`\`

**Pro tip**: Track this metric for different dayparts (breakfast, lunch, dinner) to optimize pricing and promotions.

## 6. Table Turnover Rate

**What it is**: The number of times a table is occupied by different parties during a specific period.

**Why it matters**: Higher table turnover generally means more customers served and increased revenue, but it must be balanced with maintaining a positive dining experience.

**How to calculate**: 
\`\`\`
Table Turnover Rate = Number of Parties Served / Number of Tables
\`\`\`

**Target range**: 1.5-2 turns for fine dining; 3-5 turns for casual dining

**Pro tip**: Identify bottlenecks in service that might be slowing down turnover without rushing customers.

## 7. Employee Turnover Rate

**What it is**: The rate at which employees leave and are replaced.

**Why it matters**: High turnover increases training costs and can negatively impact service quality and team morale.

**How to calculate**: 
\`\`\`
Employee Turnover Rate = (Number of Separations / Average Number of Employees) × 100
\`\`\`

**Industry average**: 75% (though successful restaurants often achieve much lower rates)

**Pro tip**: Conduct exit interviews to identify common reasons for departure and address systemic issues.

## 8. RevPASH (Revenue Per Available Seat Hour)

**What it is**: The revenue generated per available seat per hour of operation.

**Why it matters**: This sophisticated metric combines seat turnover with average check size to give a complete picture of how efficiently you're using your space.

**How to calculate**: 
\`\`\`
RevPASH = Total Revenue / (Number of Seats × Hours of Operation)
\`\`\`

**Pro tip**: Use this metric to evaluate the success of layout changes or service adjustments.

## 9. Food Cost Percentage

**What it is**: The cost of ingredients as a percentage of food sales.

**Why it matters**: This metric helps identify inefficiencies in purchasing, preparation, and waste management.

**Target range**: 28-32% of food sales

**How to calculate**: 
\`\`\`
Food Cost Percentage = (Cost of Food Used / Food Sales) × 100
\`\`\`

**Pro tip**: Implement a consistent inventory tracking system to monitor food costs weekly.

## 10. Customer Retention Rate

**What it is**: The percentage of customers who return to your restaurant.

**Why it matters**: Acquiring new customers is typically more expensive than retaining existing ones. Higher retention rates indicate customer satisfaction and loyalty.

**How to calculate**: 
\`\`\`
Customer Retention Rate = ((CE - CN) / CS) × 100
\`\`\`
Where:
- CE = Number of customers at end of period
- CN = Number of new customers acquired during period
- CS = Number of customers at start of period

**Pro tip**: Implement a loyalty program with technology that can track detailed customer visit patterns.

## Putting KPIs Into Action

Tracking these metrics is only valuable if you use the data to inform your decision-making. Here's how to implement an effective KPI monitoring system:

1. **Set up automated tracking**: Use your POS and restaurant management software to automatically collect and organize data.

2. **Create a KPI dashboard**: Develop a visual representation of your key metrics that can be reviewed at a glance.

3. **Establish benchmarks**: Set realistic targets based on industry standards and your restaurant's historical performance.

4. **Schedule regular reviews**: Set aside time weekly and monthly to analyze performance data.

5. **Share relevant metrics with staff**: Make team members aware of the KPIs they can influence.

6. **Take action**: Implement specific strategies to improve underperforming metrics.

## Conclusion

By consistently tracking these 10 essential KPIs, restaurant owners can gain valuable insights into their operations, make informed decisions, and ultimately increase profitability. Remember that metrics should be used as tools for improvement, not just numbers on a page. When properly analyzed and acted upon, these KPIs can transform your restaurant's performance and help you stay ahead in a competitive market.

Ready to start tracking these metrics but not sure where to begin? BiteBase provides powerful analytics tools specifically designed for restaurant owners. Our platform automatically calculates all these KPIs and more, giving you clear visualizations and actionable insights to improve your business performance.
    `,
    relatedPosts: [
      {
        id: 2,
        title: "How to Choose the Perfect Location for Your New Restaurant",
        slug: "restaurant-location-selection",
        excerpt: "Discover data-driven approaches to finding the ideal location for your restaurant's success.",
        coverImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop",
      },
      {
        id: 4,
        title: "Menu Engineering: The Science of Profitable Menu Design",
        slug: "menu-engineering-profitable-design",
        excerpt: "Learn how to analyze and design your menu to maximize profitability while enhancing customer satisfaction.",
        coverImage: "https://images.unsplash.com/photo-1507527825661-f86bc6fa42a8?q=80&w=2574&auto=format&fit=crop",
      },
      {
        id: 5,
        title: "Understanding Restaurant Customer Behavior with Data Analytics",
        slug: "customer-behavior-data-analytics",
        excerpt: "Discover how to gather and analyze customer data to improve service, loyalty, and revenue.",
        coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop",
      }
    ]
  };

  // In a real implementation, we would fetch the blog post data based on the slug
  // For now, we'll use the mock data above

  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    // This is a very simplified markdown renderer for demonstration
    // In a real application, you would use a library like react-markdown
    const formattedContent = content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/\n\n/gm, '</p><p class="mb-4">')
      .replace(/```([\s\S]*?)```/gm, '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>');
    
    return (
      <div 
        className="prose prose-primary lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${formattedContent}</p>` }}
      />
    );
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <BiteBaseLogo size="sm" showText={false} />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-primary-600 font-medium">Blog</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
            </nav>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 hidden sm:inline-flex"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                asChild
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Back to Blog */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
      
      {/* Featured Image */}
      <div className="relative h-72 md:h-96 w-full max-w-5xl mx-auto mb-8">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover rounded-lg shadow-lg"
          priority
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {post.category}
          </span>
        </div>
      </div>
      
      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg shadow">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative mr-3">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {post.author.name}
                </span>
                <p className="text-sm text-gray-500">{post.author.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link 
                href={`/blog?tag=${tag}`} 
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        </header>
        
        {/* Article Body */}
        <div className="article-content">
          {renderMarkdown(post.content)}
        </div>
        
        {/* Article Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <BlogInteractions title={post.title} />
          </div>
        </footer>
      </article>
      
      {/* Author Bio */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-600">{post.author.title}</p>
              <p className="mt-3 text-gray-700">
                Alex specializes in restaurant analytics and has helped over 100 restaurants improve their operations through data-driven strategies. With 15 years of experience in the industry, he brings practical insights to help restaurant owners thrive.
              </p>
              <div className="mt-4">
                <Link 
                  href={`/authors/${post.author.name.toLowerCase().replace(' ', '-')}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View all articles by this author →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {post.relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                <div className="group">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Restaurant with Data?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            BiteBase helps restaurant owners make better decisions with powerful analytics and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 text-white"
              asChild
            >
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
            >
              <Link href="/demo">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <BiteBaseLogo size="sm" showText={false} />
              <p className="text-gray-600 mt-4">
                Empowering restaurants with data-driven intelligence for better business decisions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-primary-600">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-primary-600">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resources" className="text-gray-600 hover:text-primary-600">Resource Center</Link></li>
                <li><Link href="/case-studies" className="text-gray-600 hover:text-primary-600">Case Studies</Link></li>
                <li><Link href="/webinars" className="text-gray-600 hover:text-primary-600">Webinars</Link></li>
                <li><Link href="/documentation" className="text-gray-600 hover:text-primary-600">API Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-600 hover:text-primary-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-primary-600">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} BiteBase. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 