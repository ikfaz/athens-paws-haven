import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const CookiePolicy = () => {
  useSEO({
    title: "Cookie Policy | Pet-Friendly Athens",
    description:
      "Learn how cookies are used on Pet-Friendly Athens and how you can manage cookie preferences.",
    canonicalPath: "/cookie-policy",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavLink to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </NavLink>
        
        <h1 className="text-4xl font-bold mb-8 text-foreground">Cookie Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p>We use cookies to understand how you use our service and to improve your experience. This includes personalizing content and providing a safer experience.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function properly.</li>
              <li><strong>Analytics cookies:</strong> These cookies help us understand how visitors interact with our website.</li>
              <li><strong>Preference cookies:</strong> These cookies allow the website to remember choices you make.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p>Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
