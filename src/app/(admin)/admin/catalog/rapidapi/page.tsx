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
  Settings,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  in: "path" | "query" | "body";
  default: string;
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface EndpointPreset {
  id: string;
  name: string;
  method: "GET" | "POST";
  pathTemplate: string;
  description: string;
  fields: Field[];
}

const PRESETS: EndpointPreset[] = [
  {
    id: "manufacturers",
    name: "Get Manufacturers (Makes)",
    method: "GET",
    pathTemplate: "manufacturers/list/type-id/{typeId}",
    description: "Returns all vehicle manufacturers for a selected vehicle type",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [
          { label: "Passenger Cars (1)", value: "1" },
          { label: "Commercial Vehicles (2)", value: "2" },
        ],
      },
    ],
  },
  {
    id: "models",
    name: "Get Models by Make & Region",
    method: "GET",
    pathTemplate: "models/list/type-id/{typeId}/manufacturer-id/{manufacturerId}/lang-id/{langId}/country-filter-id/{countryFilterId}",
    description: "Returns the full list of vehicle models for a chosen make, type, and country",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [
          { label: "Passenger Cars (1)", value: "1" },
          { label: "Commercial Vehicles (2)", value: "2" },
        ],
      },
      {
        name: "manufacturerId",
        label: "Manufacturer ID",
        type: "number",
        in: "path",
        default: "5", // Audi
        required: true,
        placeholder: "e.g. 5 for Audi, 184 for VW",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "path",
        default: "4",
        required: true,
        options: [
          { label: "English (4)", value: "4" },
          { label: "German (1)", value: "1" },
        ],
      },
      {
        name: "countryFilterId",
        label: "Country Filter ID",
        type: "select",
        in: "path",
        default: "63",
        required: true,
        options: [
          { label: "South Africa (63)", value: "63" },
          { label: "Germany (64)", value: "64" },
        ],
      },
    ],
  },
  {
    id: "vehicles",
    name: "Get Engine Variants by Model",
    method: "GET",
    pathTemplate: "types/type-id/{typeId}/list-vehicles-types/{modelId}/lang-id/{langId}/country-filter-id/{countryFilterId}",
    description: "Returns all available engine versions and specifications for a specific vehicle model",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [
          { label: "Passenger Cars (1)", value: "1" },
          { label: "Commercial Vehicles (2)", value: "2" },
        ],
      },
      {
        name: "modelId",
        label: "Model ID",
        type: "number",
        in: "path",
        default: "5626", // Audi A4
        required: true,
        placeholder: "e.g. 5626",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "path",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
      {
        name: "countryFilterId",
        label: "Country Filter ID",
        type: "select",
        in: "path",
        default: "63",
        required: true,
        options: [{ label: "South Africa (63)", value: "63" }],
      },
    ],
  },
  {
    id: "category_tree",
    name: "Get Global Catalog Categories Hierarchy",
    method: "GET",
    pathTemplate: "category/type-id/{typeId}/list-category-tree-structure/lang-id/{langId}",
    description: "Returns the complete tree structure of product categories (Engine, Body, etc.)",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [
          { label: "Passenger Cars (1)", value: "1" },
          { label: "Commercial Vehicles (2)", value: "2" },
        ],
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "path",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "vehicle_categories",
    name: "Get System Category Tree for Vehicle",
    method: "GET",
    pathTemplate: "category/type-id/{typeId}/products-groups-variant-3/{vehicleId}/lang-id/{langId}",
    description: "Returns a category tree of parts specific to the selected vehicle variant, grouped by major systems",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [{ label: "Passenger Cars (1)", value: "1" }],
      },
      {
        name: "vehicleId",
        label: "Vehicle ID",
        type: "number",
        in: "path",
        default: "19942",
        required: true,
        placeholder: "e.g. 19942",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "path",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "parts_list",
    name: "Get Parts by Category & Vehicle",
    method: "GET",
    pathTemplate: "articles/list/type-id/{typeId}/vehicle-id/{vehicleId}/category-id/{categoryId}/lang-id/{langId}",
    description: "Returns all parts matching a specific vehicle modification and product category ID",
    fields: [
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "path",
        default: "1",
        required: true,
        options: [{ label: "Passenger Cars (1)", value: "1" }],
      },
      {
        name: "vehicleId",
        label: "Vehicle ID",
        type: "number",
        in: "path",
        default: "19942",
        required: true,
      },
      {
        name: "categoryId",
        label: "Category ID",
        type: "number",
        in: "path",
        default: "100260", // Air Filter
        required: true,
        placeholder: "e.g. 100260 for Air Filter",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "path",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "search_articles_get",
    name: "Search Parts by Part Number (GET)",
    method: "GET",
    pathTemplate: "artlookup/search-articles-by-article-no",
    description: "Searches for matching parts using an article identifier (e.g. IAM, OEM, or EAN) via GET query parameters",
    fields: [
      {
        name: "articleNo",
        label: "Part Number",
        type: "text",
        in: "query",
        default: "C 2029",
        required: true,
        placeholder: "e.g. C 2029",
      },
      {
        name: "articleType",
        label: "Identifier Type",
        type: "select",
        in: "query",
        default: "ArticleNumber",
        required: true,
        options: [
          { label: "Article Number", value: "ArticleNumber" },
          { label: "IAM Number", value: "IAMNumber" },
          { label: "Trade Number", value: "TradeNumber" },
          { label: "OEM/OE Number", value: "OENumber" },
          { label: "EAN Code", value: "EAN" },
        ],
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "query",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "search_articles_post",
    name: "Search Parts by Part Number (POST)",
    method: "POST",
    pathTemplate: "artlookup/search-articles-by-article-no",
    description: "Searches for matching parts using an article identifier via POST body request",
    fields: [
      {
        name: "articleNo",
        label: "Part Number",
        type: "text",
        in: "body",
        default: "0 242 236 561",
        required: true,
        placeholder: "e.g. 0 242 236 561",
      },
      {
        name: "articleType",
        label: "Identifier Type",
        type: "select",
        in: "body",
        default: "ArticleNumber",
        required: true,
        options: [
          { label: "Article Number", value: "ArticleNumber" },
          { label: "IAM Number", value: "IAMNumber" },
          { label: "Trade Number", value: "TradeNumber" },
          { label: "OEM/OE Number", value: "OENumber" },
          { label: "EAN Code", value: "EAN" },
        ],
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "body",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "equivalent_oems",
    name: "Get Equivalent OEM Numbers",
    method: "POST",
    pathTemplate: "articles-oem/all-equal-oem-no",
    description: "Retrieves all equivalent OEM cross-reference numbers and brands for a given OE part number",
    fields: [
      {
        name: "articleOemNo",
        label: "OEM Part Number",
        type: "text",
        in: "body",
        default: "517501D000",
        required: true,
        placeholder: "e.g. 517501D000",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "body",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "article_details",
    name: "Get Part Complete Details (POST)",
    method: "POST",
    pathTemplate: "articles/article-id-complete-details",
    description: "Returns comprehensive specifications, OEM cross-references, and supplier details for a specific part ID",
    fields: [
      {
        name: "articleId",
        label: "Article ID",
        type: "text",
        in: "body",
        default: "131540",
        required: true,
        placeholder: "e.g. 131540",
      },
      {
        name: "typeId",
        label: "Vehicle Type",
        type: "select",
        in: "body",
        default: "1",
        required: true,
        options: [{ label: "Passenger Cars (1)", value: "1" }],
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "body",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
      {
        name: "countryFilterId",
        label: "Country Filter ID",
        type: "select",
        in: "body",
        default: "63",
        required: true,
        options: [{ label: "South Africa (63)", value: "63" }],
      },
    ],
  },
  {
    id: "article_media",
    name: "Get Part Media & Images (POST)",
    method: "POST",
    pathTemplate: "articles/article-all-media-info",
    description: "Returns all available product images, schematics, and direct URLs for a specific part ID",
    fields: [
      {
        name: "articleId",
        label: "Article ID",
        type: "text",
        in: "body",
        default: "125",
        required: true,
        placeholder: "e.g. 125",
      },
      {
        name: "langId",
        label: "Language ID",
        type: "select",
        in: "body",
        default: "4",
        required: true,
        options: [{ label: "English (4)", value: "4" }],
      },
    ],
  },
  {
    id: "vin_decoder",
    name: "VIN Decoder (All-in-One)",
    method: "GET",
    pathTemplate: "vin/decoder-v5/{vinNo}",
    description: "Decodes a vehicle's VIN code to return make, model, specifications, and year in one combined result",
    fields: [
      {
        name: "vinNo",
        label: "VIN Code",
        type: "text",
        in: "path",
        default: "WDBFA68F42F202731",
        required: true,
        placeholder: "Enter 17-character VIN",
      },
    ],
  },
];

export default function RapidApiExplorerPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initialVals: Record<string, string> = {};
    PRESETS[0].fields.forEach(f => {
      initialVals[f.name] = f.default;
    });
    return initialVals;
  });
  
  // Custom mode state
  const [customMethod, setCustomMethod] = useState<"GET" | "POST">("GET");
  const [customPath, setCustomPath] = useState("manufacturers/list/type-id/1");
  const [customBody, setCustomBody] = useState("{\n  \"key\": \"value\"\n}");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ duration: number; size: string; status: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectPreset = (value: string) => {
    setSelectedPresetId(value);
    if (value !== "custom") {
      const preset = PRESETS.find(p => p.id === value);
      if (preset) {
        const initialVals: Record<string, string> = {};
        preset.fields.forEach(f => {
          initialVals[f.name] = f.default;
        });
        setFormValues(initialVals);
      }
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const checkJsonValid = (str: string) => {
    if (!str.trim()) return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const parseJsonBody = (str: string) => {
    if (!str.trim()) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  // Helper to compile final request parameters
  const computeRequestDetails = () => {
    if (selectedPresetId === "custom") {
      return {
        finalMethod: customMethod,
        finalPath: customPath,
        finalBody: customMethod === "POST" ? parseJsonBody(customBody) : null,
        isValidBody: customMethod === "POST" ? checkJsonValid(customBody) : true,
      };
    }

    const preset = PRESETS.find(p => p.id === selectedPresetId);
    if (!preset) {
      return { finalMethod: "GET" as const, finalPath: "", finalBody: null, isValidBody: true };
    }

    let resolvedPath = preset.pathTemplate;
    const queryParams = new URLSearchParams();
    const bodyParams: Record<string, unknown> = {};

    preset.fields.forEach(field => {
      const val = formValues[field.name] !== undefined ? formValues[field.name] : field.default;
      if (field.in === "path") {
        resolvedPath = resolvedPath.replace(`{${field.name}}`, val);
      } else if (field.in === "query") {
        if (val) queryParams.append(field.name, val);
      } else if (field.in === "body") {
        bodyParams[field.name] = val;
      }
    });

    const queryString = queryParams.toString();
    const finalPath = queryString ? `${resolvedPath}?${queryString}` : resolvedPath;

    return {
      finalMethod: preset.method,
      finalPath,
      finalBody: preset.method === "POST" ? bodyParams : null,
      isValidBody: true,
    };
  };

  const { finalMethod, finalPath, finalBody, isValidBody } = computeRequestDetails();

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidBody) {
      setError("Request rejected: Body must be valid JSON.");
      return;
    }
    if (!finalPath.trim()) {
      setError("Request path cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setStats(null);
    setSearchQuery("");

    const startTime = performance.now();

    try {
      const cleanPath = finalPath.startsWith("/") ? finalPath.slice(1) : finalPath;
      const url = `/api/external-catalog/${cleanPath}`;

      const options: RequestInit = {
        method: finalMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (finalMethod === "POST" && finalBody !== null) {
        options.body = JSON.stringify(finalBody);
      }

      const res = await fetch(url, options);

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

    const apiName = finalPath.split("/").filter(Boolean)[0] || "rapidapi-data";
    link.download = `${apiName}-export.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFilteredJSON = () => {
    if (!response) return "";
    const pretty = JSON.stringify(response, null, 2);
    if (!searchQuery.trim()) return pretty;

    const lines = pretty.split("\n");
    const matched = lines.filter(line =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matched.length === 0) return "// No matches found for query: " + searchQuery;
    return `// Filtered Matches (${matched.length} lines):\n\n` + matched.join("\n");
  };

  const selectedPreset = PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 bg-background">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            RapidAPI Explorer
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Interact directly with the RapidAPI Auto Parts Catalog. Test various search parameters, inspect details, and fetch vehicle metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Request Builder */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="bg-muted/35 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary animate-spin-[spin_3s_linear_infinite]" style={{ animationDuration: "8s" }} />
                Query Settings
              </CardTitle>
              <CardDescription>
                Select an endpoint preset or configure a custom API route below.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Preset Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">API Endpoint Preset</Label>
                <Select onValueChange={handleSelectPreset} defaultValue={selectedPresetId}>
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue placeholder="Select preset endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">-- Custom API Request --</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPreset && (
                <div className="bg-muted/50 p-3.5 rounded-lg border border-border text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">{selectedPreset.method}</Badge>
                    <code className="font-semibold text-foreground break-all">{selectedPreset.pathTemplate}</code>
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                    {selectedPreset.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Dynamic Parameter Fields */}
              <form onSubmit={handleFetch} className="space-y-5">
                {selectedPresetId !== "custom" && selectedPreset && (
                  <div className="space-y-4">
                    {selectedPreset.fields.map((field) => {
                      const fieldVal = formValues[field.name] || "";
                      return (
                        <div key={field.name} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label htmlFor={field.name} className="text-xs font-semibold">
                              {field.label}
                              {field.required && <span className="text-destructive ml-0.5">*</span>}
                            </Label>
                            <Badge variant="outline" className="text-[8px] px-1 py-0 font-mono uppercase bg-muted/30 text-muted-foreground">
                              {field.in}
                            </Badge>
                          </div>

                          {field.type === "select" && field.options ? (
                            <Select
                              value={fieldVal}
                              onValueChange={(val) => handleInputChange(field.name, val)}
                            >
                              <SelectTrigger id={field.name} className="bg-card">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={field.name}
                              required={field.required}
                              placeholder={field.placeholder}
                              type={field.type === "number" ? "number" : "text"}
                              value={fieldVal}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="text-xs focus-visible:ring-primary font-mono bg-card"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Custom Fields configuration */}
                {selectedPresetId === "custom" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="custom-method" className="text-xs font-semibold">HTTP Method</Label>
                      <Select
                        value={customMethod}
                        onValueChange={(val) => setCustomMethod(val as "GET" | "POST")}
                      >
                        <SelectTrigger id="custom-method" className="bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom-path" className="text-xs font-semibold">API Path</Label>
                      <Input
                        id="custom-path"
                        value={customPath}
                        onChange={(e) => setCustomPath(e.target.value)}
                        placeholder="e.g. manufacturers/list/type-id/1"
                        className="font-mono text-xs focus-visible:ring-primary bg-card"
                        required
                      />
                    </div>

                    {customMethod === "POST" && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="custom-body" className="text-xs font-semibold">JSON Request Body</Label>
                          {!checkJsonValid(customBody) && (
                            <span className="text-[10px] text-destructive font-bold">Invalid JSON Syntax</span>
                          )}
                        </div>
                        <textarea
                          id="custom-body"
                          value={customBody}
                          onChange={(e) => setCustomBody(e.target.value)}
                          rows={6}
                          className="w-full rounded-md border border-input bg-card px-3 py-2 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                        />
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full font-semibold shadow-md mt-2">
                  {loading ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Executing request...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4 fill-current text-primary-foreground" />
                      Run Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Request Live Preview Panel */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="py-3 bg-muted/20 border-b border-border">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-4 w-4" />
                Live Request Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 font-mono text-[10px] space-y-3 text-muted-foreground bg-muted/5">
              <div className="flex items-start gap-1.5">
                <Badge variant="secondary" className="px-1.5 py-0 rounded text-[9px] font-mono font-bold">
                  {finalMethod}
                </Badge>
                <div className="text-foreground font-semibold break-all leading-normal">
                  /api/external-catalog/{finalPath || "..."}
                </div>
              </div>
              {finalMethod === "POST" && finalBody && (
                <div className="border border-border p-2 rounded-lg bg-card">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/80 block mb-1">
                    payload (Body)
                  </span>
                  <pre className="text-foreground max-h-[150px] overflow-y-auto leading-relaxed whitespace-pre font-mono text-[10px]">
                    {JSON.stringify(finalBody, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Response Viewer */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border shadow-md h-full flex flex-col min-h-[600px]">
            <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between space-y-0 border-b border-border">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  JSON Response
                </CardTitle>
                <CardDescription>
                  Prettified API response returned by the external auto parts catalog API.
                </CardDescription>
              </div>

              {/* Action Buttons */}
              {!!response && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} title="Copy JSON" className="h-8 px-2.5 bg-card">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} title="Download JSON File" className="h-8 px-2.5 bg-card">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col pt-6 bg-card/10">
              {/* Stats Bar */}
              {stats && (
                <div className="flex flex-wrap gap-4 items-center mb-4 text-xs font-semibold">
                  <Badge variant={stats.status >= 200 && stats.status < 300 ? "outline" : "destructive"} className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    HTTP {stats.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-muted-foreground font-mono">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {stats.duration} ms
                  </span>
                  <Separator orientation="vertical" className="h-4 bg-border hidden sm:block" />
                  <span className="text-muted-foreground font-mono">
                    Payload Size: {stats.size}
                  </span>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-24">
                  <RotateCcw className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">Requesting data from RapidAPI Auto Parts Catalog...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-3" />
                  <h4 className="text-lg font-bold text-foreground mb-1">Request Failed</h4>
                  <p className="text-xs text-destructive max-w-md font-medium leading-relaxed bg-destructive/10 p-4 rounded-lg border border-destructive/20 font-mono text-left whitespace-pre-wrap">
                    {error}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !response && !error && (
                <div className="flex-1 flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
                  <Terminal className="h-12 w-12 text-muted-foreground/60 mb-3" />
                  <h4 className="text-lg font-bold text-foreground">API Playground Ready</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
                    Set up your request query parameters in the left settings pane, verify the preview, and run.
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
                      className="pl-9 text-xs focus-visible:ring-primary font-mono bg-card"
                    />
                  </div>

                  {/* Pre Block */}
                  <div className="flex-1 relative rounded-xl border border-border overflow-hidden bg-muted/30 font-mono text-[11px] flex flex-col">
                    <pre className="p-4 overflow-auto max-h-[520px] w-full whitespace-pre-wrap leading-relaxed text-foreground select-text selection:bg-primary/20 flex-1">
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
