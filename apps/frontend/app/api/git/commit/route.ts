import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, push = false } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Commit message is required' }, { status: 400 });
    }

    // Check if current directory is a git repository
    const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
    
    if (!isGitRepo) {
      return NextResponse.json({ error: 'Not a git repository' }, { status: 400 });
    }

    // Stage all changes
    execSync('git add -A');
    
    // Commit changes with provided message
    const commitOutput = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`).toString();
    
    // Extract commit ID
    const commitIdMatch = commitOutput.match(/\[[\w\s]+\s([a-f0-9]+)\]/);
    const commitId = commitIdMatch ? commitIdMatch[1] : 'unknown';
    
    let pushOutput = '';
    
    // Push to remote if requested
    if (push) {
      try {
        // Get current branch
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        pushOutput = execSync(`git push origin ${branch}`).toString();
      } catch (pushError) {
        return NextResponse.json({ 
          error: 'Committed successfully, but push failed', 
          commitId,
          pushError: pushError instanceof Error ? pushError.message : String(pushError)
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      commitId,
      message: 'Changes committed successfully' + (push ? ' and pushed to remote' : ''),
      pushOutput: push ? pushOutput : null
    });
  } catch (error) {
    console.error('Error during git operations:', error);
    
    // Check if there are no changes to commit
    if (error instanceof Error && error.message.includes('nothing to commit')) {
      return NextResponse.json({ 
        error: 'Nothing to commit, working tree clean' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Git operation failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
