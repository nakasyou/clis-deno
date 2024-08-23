# clis-deno
My minimal clis written in Deno.

## merge-mp4
You can merge mp4s using ffmpeg
```bash
deno install -A -n merge-mp4 jsr:@ns/cli/merge-mp4
```

```bash
merge-mp4 -O=output.mp4 https://example.com/a.mp4 https://example.com/b.mp4 https://example.com/c.mp4
```
