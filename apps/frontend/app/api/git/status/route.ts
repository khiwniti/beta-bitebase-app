import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Check if current directory is a git repository
    const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
    
    if (!isGitRepo) {
      return NextResponse.json({ 
        isRepo: false,
        message: 'Not a git repository' 
      });
    }

    // Get current branch
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    
    // Get number of changed files
    const changedFiles = execSync('git status --porcelain').toString().trim();
    const changes = changedFiles ? changedFiles.split('\n').length : 0;
    
    // Get last commit info
    let lastCommit = '';
    try {
      lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%ar)"').toString().trim();
    } catch (error) {
      lastCommit = 'No commits yet';
    }

    return NextResponse.json({
      isRepo: true,
      branch,
      changes,
      lastCommit
    });
  } catch (error) {
    console.error('Error checking git status:', error);
    return NextResponse.json({ 
      error: 'Failed to check git status',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
