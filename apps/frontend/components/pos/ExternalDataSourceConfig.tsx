"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  Database,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ExternalDataSourceConfigProps {
  posSystemId: string;
  onConfigurationSaved?: (config: any) => void;
}

interface DataSourceConfig {
  type: "postgresql" | "google_sheets" | "csv_import";
  name: string;
  configuration: any;
}

export default function ExternalDataSourceConfig({
  posSystemId,
  onConfigurationSaved,
}: ExternalDataSourceConfigProps) {
  const [activeTab, setActiveTab] = useState("postgresql");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [configurations, setConfigurations] = useState<DataSourceConfig[]>([]);

  // PostgreSQL configuration state
  const [pgConfig, setPgConfig] = useState({
    name: "",
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    ssl: true,
  });

  // Google Sheets configuration state
  const [sheetsConfig, setSheetsConfig] = useState({
    name: "",
    spreadsheetId: "",
    sheetName: "Sheet1",
    serviceAccountKey: "",
  });

  // CSV Import configuration state
  const [csvConfig, setCsvConfig] = useState({
    name: "",
    filePath: "",
    delimiter: ",",
    hasHeader: true,
    encoding: "utf-8",
  });

  const testConnection = async (sourceType: string, config: any) => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const token = localStorage.getItem("bitebase_token");
      const response = await fetch("/api/pos/configure-external-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          posSystemId,
          sourceType,
          configuration: config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Configuration test failed");
      }

      const result = await response.json();
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test connection failed");
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfiguration = async (sourceType: string, config: any) => {
    setIsConfiguring(true);
    setError(null);

    try {
      const token = localStorage.getItem("bitebase_token");
      const response = await fetch("/api/pos/configure-external-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          posSystemId,
          sourceType,
          configuration: config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Configuration save failed");
      }

      const result = await response.json();

      // Add to configurations list
      const newConfig: DataSourceConfig = {
        type: sourceType as any,
        name: config.name,
        configuration: config,
      };
      setConfigurations((prev) => [...prev, newConfig]);

      onConfigurationSaved?.(result);

      // Reset form
      if (sourceType === "postgresql") {
        setPgConfig({
          name: "",
          host: "",
          port: "5432",
          database: "",
          username: "",
          password: "",
          ssl: true,
        });
      } else if (sourceType === "google_sheets") {
        setSheetsConfig({
          name: "",
          spreadsheetId: "",
          sheetName: "Sheet1",
          serviceAccountKey: "",
        });
      } else if (sourceType === "csv_import") {
        setCsvConfig({
          name: "",
          filePath: "",
          delimiter: ",",
          hasHeader: true,
          encoding: "utf-8",
        });
      }

      setTestResult(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Configuration save failed",
      );
    } finally {
      setIsConfiguring(false);
    }
  };

  const renderPostgreSQLConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pg-name">Configuration Name</Label>
          <Input
            id="pg-name"
            value={pgConfig.name}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Main Database"
          />
        </div>
        <div>
          <Label htmlFor="pg-host">Host</Label>
          <Input
            id="pg-host"
            value={pgConfig.host}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, host: e.target.value }))
            }
            placeholder="localhost"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pg-port">Port</Label>
          <Input
            id="pg-port"
            value={pgConfig.port}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, port: e.target.value }))
            }
            placeholder="5432"
          />
        </div>
        <div>
          <Label htmlFor="pg-database">Database</Label>
          <Input
            id="pg-database"
            value={pgConfig.database}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, database: e.target.value }))
            }
            placeholder="restaurant_data"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pg-username">Username</Label>
          <Input
            id="pg-username"
            value={pgConfig.username}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="postgres"
          />
        </div>
        <div>
          <Label htmlFor="pg-password">Password</Label>
          <Input
            id="pg-password"
            type="password"
            value={pgConfig.password}
            onChange={(e) =>
              setPgConfig((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="pg-ssl"
          checked={pgConfig.ssl}
          onChange={(e) =>
            setPgConfig((prev) => ({ ...prev, ssl: e.target.checked }))
          }
        />
        <Label htmlFor="pg-ssl">Use SSL Connection</Label>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => testConnection("postgresql", pgConfig)}
          disabled={
            isTesting ||
            !pgConfig.host ||
            !pgConfig.database ||
            !pgConfig.username
          }
        >
          {isTesting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Database className="w-4 h-4 mr-2" />
          )}
          Test Connection
        </Button>

        <Button
          onClick={() => saveConfiguration("postgresql", pgConfig)}
          disabled={isConfiguring || !testResult?.success || !pgConfig.name}
        >
          {isConfiguring ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Save Configuration
        </Button>
      </div>
    </div>
  );

  const renderGoogleSheetsConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sheets-name">Configuration Name</Label>
        <Input
          id="sheets-name"
          value={sheetsConfig.name}
          onChange={(e) =>
            setSheetsConfig((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Inventory Tracking"
        />
      </div>

      <div>
        <Label htmlFor="sheets-id">Spreadsheet ID</Label>
        <Input
          id="sheets-id"
          value={sheetsConfig.spreadsheetId}
          onChange={(e) =>
            setSheetsConfig((prev) => ({
              ...prev,
              spreadsheetId: e.target.value,
            }))
          }
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
        />
        <p className="text-sm text-gray-500 mt-1">
          Found in the Google Sheets URL:
          docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
        </p>
      </div>

      <div>
        <Label htmlFor="sheets-name-input">Sheet Name</Label>
        <Input
          id="sheets-name-input"
          value={sheetsConfig.sheetName}
          onChange={(e) =>
            setSheetsConfig((prev) => ({ ...prev, sheetName: e.target.value }))
          }
          placeholder="Sheet1"
        />
      </div>

      <div>
        <Label htmlFor="sheets-key">Service Account Key (JSON)</Label>
        <textarea
          id="sheets-key"
          className="w-full h-32 p-2 border rounded-md font-mono text-sm"
          value={sheetsConfig.serviceAccountKey}
          onChange={(e) =>
            setSheetsConfig((prev) => ({
              ...prev,
              serviceAccountKey: e.target.value,
            }))
          }
          placeholder='{"type": "service_account", "project_id": "...", ...}'
        />
        <p className="text-sm text-gray-500 mt-1">
          Download from Google Cloud Console → Service Accounts
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => testConnection("google_sheets", sheetsConfig)}
          disabled={
            isTesting ||
            !sheetsConfig.spreadsheetId ||
            !sheetsConfig.serviceAccountKey
          }
        >
          {isTesting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 mr-2" />
          )}
          Test Connection
        </Button>

        <Button
          onClick={() => saveConfiguration("google_sheets", sheetsConfig)}
          disabled={isConfiguring || !testResult?.success || !sheetsConfig.name}
        >
          {isConfiguring ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Save Configuration
        </Button>
      </div>
    </div>
  );

  const renderCSVConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="csv-name">Configuration Name</Label>
        <Input
          id="csv-name"
          value={csvConfig.name}
          onChange={(e) =>
            setCsvConfig((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Sales Data Import"
        />
      </div>

      <div>
        <Label htmlFor="csv-path">File Path or URL</Label>
        <Input
          id="csv-path"
          value={csvConfig.filePath}
          onChange={(e) =>
            setCsvConfig((prev) => ({ ...prev, filePath: e.target.value }))
          }
          placeholder="/path/to/data.csv or https://example.com/data.csv"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="csv-delimiter">Delimiter</Label>
          <Select
            value={csvConfig.delimiter}
            onValueChange={(value) =>
              setCsvConfig((prev) => ({ ...prev, delimiter: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">Comma (,)</SelectItem>
              <SelectItem value=";">Semicolon (;)</SelectItem>
              <SelectItem value="\t">Tab</SelectItem>
              <SelectItem value="|">Pipe (|)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="csv-encoding">Encoding</Label>
          <Select
            value={csvConfig.encoding}
            onValueChange={(value) =>
              setCsvConfig((prev) => ({ ...prev, encoding: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf-8">UTF-8</SelectItem>
              <SelectItem value="utf-16">UTF-16</SelectItem>
              <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="csv-header"
          checked={csvConfig.hasHeader}
          onChange={(e) =>
            setCsvConfig((prev) => ({ ...prev, hasHeader: e.target.checked }))
          }
        />
        <Label htmlFor="csv-header">File has header row</Label>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => testConnection("csv_import", csvConfig)}
          disabled={isTesting || !csvConfig.filePath}
        >
          {isTesting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Validate File
        </Button>

        <Button
          onClick={() => saveConfiguration("csv_import", csvConfig)}
          disabled={isConfiguring || !testResult?.success || !csvConfig.name}
        >
          {isConfiguring ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Save Configuration
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Data Sources</CardTitle>
          <CardDescription>
            Connect external data sources to enhance your POS integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="postgresql"
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                PostgreSQL
              </TabsTrigger>
              <TabsTrigger
                value="google_sheets"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Google Sheets
              </TabsTrigger>
              <TabsTrigger
                value="csv_import"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                CSV Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="postgresql" className="mt-6">
              {renderPostgreSQLConfig()}
            </TabsContent>

            <TabsContent value="google_sheets" className="mt-6">
              {renderGoogleSheetsConfig()}
            </TabsContent>

            <TabsContent value="csv_import" className="mt-6">
              {renderCSVConfig()}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {testResult && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">
                    Connection Test Successful!
                  </div>
                  {testResult.testConnection && (
                    <div className="text-sm space-y-1">
                      {Object.entries(testResult.testConnection).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, " $1")}:
                            </span>
                            <span className="font-mono">{String(value)}</span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {configurations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configured Data Sources</CardTitle>
            <CardDescription>
              Manage your existing data source configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {configurations.map((config, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {config.type === "postgresql" && (
                      <Database className="w-5 h-5 text-blue-500" />
                    )}
                    {config.type === "google_sheets" && (
                      <FileSpreadsheet className="w-5 h-5 text-green-500" />
                    )}
                    {config.type === "csv_import" && (
                      <Upload className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {config.type.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Connected</Badge>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
