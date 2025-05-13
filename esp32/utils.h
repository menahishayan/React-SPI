
#include <string.h>

void removeLeadingZeros(char str[])
{
    int len = strlen(str);
    int i, j;

    // Find the index of the first non-zero digit
    for (i = 0; i < len; i++)
    {
        if (str[i] != '0')
        {
            break;
        }
    }

    // Shift the array elements to remove leading zeros
    if (i > 0)
    {
        for (j = 0; j < len - i; j++)
        {
            str[j] = str[j + i];
        }
        str[j] = '\0'; // Null-terminate the string
    }
}