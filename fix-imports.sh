#!/bin/bash

# Fix all @bitebase/ui imports to use local components
cd /workspace/beta-bitebase-app/apps/frontend

# Find all TypeScript/TSX files and replace @bitebase/ui imports
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "@bitebase/ui"|from "../../components/ui/button"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|} from "@bitebase/ui"|} from "../../components/ui/card"|g'

# More specific replacements for different components
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Button } from "../../components/ui/card"|import { Button } from "../../components/ui/button"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/button"|import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Badge } from "../../components/ui/button"|import { Badge } from "../../components/ui/badge"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Input } from "../../components/ui/button"|import { Input } from "../../components/ui/input"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Label } from "../../components/ui/button"|import { Label } from "../../components/ui/label"|g'
find app/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/button"|import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"|g'

echo "Fixed imports in all files"