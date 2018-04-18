export const formatPrice = value => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}