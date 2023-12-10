export default function exists(filename: string): boolean {
  try {
    Deno.statSync(filename);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}
