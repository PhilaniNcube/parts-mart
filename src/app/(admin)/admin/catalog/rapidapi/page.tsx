"use client";

import { useState } from "react";
import {
  Play,
  Copy,
  Download,
  Search,
  Terminal,
  Clock,
  FileCode,
  AlertCircle,
  Check,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Preset configurations for the API Explorer
const PRESETS = [
  {
    name: "Get Manufacturers (Cars, South Africa)",
    path: "manufacturers/list/type-id/1/lang-id/4/country-filter-id/63",
    description: "Lists passenger vehicle manufacturers active in South Africa",
  },
  {
    name: "Get Models (Audi, Cars, South Africa)",
    path: "models/list/type-id/1/manufacturer-id/5/lang-id/4/country-filter-id/63",
    description: "Lists vehicle models for Audi (Manufacturer ID: 5)",
  },
  {
    name: "Get Vehicles/Engines (Audi 80 B4, South Africa)",
    path: "vehicles/list/type-id/1/manufacturer-id/5/model-id/1/lang-id/4/country-filter-id/63",
    description: "Lists variants/engines for Audi 80 B4 (Model ID: 1)",
  },
];

export default function RapidApiExplorerPage() {
  const [path, setPath] = useState(PRESETS[0].path);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ duration: number; size: string; status: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectPreset = (value: string) => {
    if (value === "custom") return;
    const preset = PRESETS.find(p => p.path === value);
    if (preset) {
      setPath(preset.path);
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setStats(null);
    setSearchQuery("");

    const startTime = performance.now();

    try {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      const res = await fetch(`/api/external-catalog/${cleanPath}`);

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const data = await res.json();
      const rawText = JSON.stringify(data);
      const sizeInKb = (new Blob([rawText]).size / 1024).toFixed(2);

      setStats({
        duration,
        size: `${sizeInKb} KB`,
        status: res.status,
      });

      if (!res.ok) {
        throw new Error(data.error || `HTTP error ${res.status}`);
      }

      setResponse(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to execute catalog request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Create clean file name based on API action
    const apiName = path.split("/").filter(Boolean)[0] || "rapidapi-data";
    link.download = `${apiName}-export.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to filter JSON content if a query is supplied
  const getFilteredJSON = () => {
    if (!response) return "";
    const pretty = JSON.stringify(response, null, 2);
    if (!searchQuery.trim()) return pretty;

    // Return only matching lines or highlight matching sections
    const lines = pretty.split("\n");
    const matched = lines.filter(line =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matched.length === 0) return "// No matches found for query: " + searchQuery;
    return `// Filtered Matches (${matched.length} lines):\n\n` + matched.join("\n");
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">RapidAPI Explorer</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Query the Auto Parts Catalog API in real-time, view live JSON responses, and download datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Panel: Query Builder */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Query Settings
              </CardTitle>
              <CardDescription>
                Build your request URL or choose from pre-configured South African catalog presets.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <form onSubmit={handleFetch} className="space-y-4">
                {/* Preset Selector */}
                <div className="space-y-1.5">
                  <Label>Preset Endpoints</Label>
                  <Select onValueChange={handleSelectPreset} defaultValue={PRESETS[0].path}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select preset endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESETS.map((p, idx) => (
                        <SelectItem key={idx} value={p.path}>
                          {p.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Endpoint Path</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* API Request Path */}
                <div className="space-y-1.5">
                  <Label htmlFor="api-path">API Path</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-muted-foreground font-mono bg-muted py-1 px-1.5 rounded border border-border select-none">
                      /api/external-catalog/
                    </span>
                    <Input
                      id="api-path"
                      required
                      placeholder="e.g. manufacturers/list/type-id/1"
                      className="pl-44 font-mono text-xs text-foreground focus-visible:ring-primary"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Path will append to your RapidAPI proxy host. Required query strings can be attached to the path directly.
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full font-semibold shadow-sm transition-all hover:opacity-95">
                    {loading ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Fetching Data...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Panel: Response Viewer */}
        <div className="lg:col-span-7">
          <Card className="border-border shadow-md h-full flex flex-col">
            <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  JSON Response
                </CardTitle>
                <CardDescription>
                  Response results formatted and prettified for inspection.
                </CardDescription>
              </div>

              {/* Action buttons */}
              {!!response && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} title="Copy JSON" className="h-8 px-2.5">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} title="Download JSON File" className="h-8 px-2.5">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-6 min-h-[400px]">
              {/* Stats Bar */}
              {stats && (
                <div className="flex flex-wrap gap-4 items-center mb-4 text-sm font-semibold">
                  <Badge variant={stats.status >= 200 && stats.status < 300 ? "outline" : "destructive"} className="px-2 py-0.5 rounded-md font-mono text-xs">
                    HTTP {stats.status}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {stats.duration} ms
                  </span>
                  <Separator orientation="vertical" className="h-4 bg-border hidden sm:block" />
                  <span className="text-muted-foreground text-xs font-mono">
                    Size: {stats.size}
                  </span>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
                  <RotateCcw className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">Requesting data from RapidAPI...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-3" />
                  <h4 className="text-lg font-bold text-foreground mb-1">Request Failed</h4>
                  <p className="text-sm text-destructive max-w-md font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !response && !error && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-xl bg-card">
                  <Terminal className="h-12 w-12 text-muted-foreground mb-3" />
                  <h4 className="text-lg font-bold text-foreground">API Ready to Test</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
                    Configure your query parameters on the left panel and click &quot;Run Request&quot; to test.
                  </p>
                </div>
              )}

              {/* JSON Prettier */}
              {!!response && !loading && (
                <div className="flex-1 flex flex-col space-y-3">
                  {/* Search Filter over JSON */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter response lines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-xs focus-visible:ring-primary"
                    />
                  </div>

                  {/* Pre Block */}
                  <div className="flex-1 relative rounded-xl border border-border overflow-hidden bg-muted/40 font-mono text-xs">
                    <pre className="p-4 overflow-auto max-h-[480px] w-full whitespace-pre-wrap leading-relaxed text-foreground select-text selection:bg-primary/25">
                      <code>{getFilteredJSON()}</code>
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
