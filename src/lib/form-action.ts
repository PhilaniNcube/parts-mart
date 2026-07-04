// Server actions used as a plain <form action={…}> must be typed as returning
// Promise<void>, but our actions return a discriminated ActionResult for
// useActionState use. This helper relaxly casts for plain server-component forms.
export function asFormAction<T>(fn: (formData: FormData) => Promise<T>): (formData: FormData) => Promise<void> {
  return fn as unknown as (formData: FormData) => Promise<void>;
}