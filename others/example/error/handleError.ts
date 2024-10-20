function catchError<T, E extends new (message?: string) => Error>(
  p: Promise<T>,
  errors: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return p
    .then((data) => [undefined, data] as [undefined, T])
    .catch((err) => {
      if (err === undefined) return [err]
      if (errors.some((e) => err instanceof e)) return [err]
      throw err
    })
}

type User = { id: number; name: string }

class InvalidIdError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'InvalidIdError'
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getUser(id: number): Promise<User> {
  await wait(1000)
  if (id === 0) throw new InvalidIdError('Invalid id')
  return { id, name: 'User' }
}

async function main() {
  const [err, user] = await catchError(getUser(0), [InvalidIdError])
  if (err) {
    console.error(err)
    return
  }
  console.log(user)
}

main()
